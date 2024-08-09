

const Payment = require("../models/payment-model");

const Request =require("../models/request-model")
const sendMail = require('../../utils/nodeMailer');
const { validationResult } = require("express-validator");
const _ = require('lodash');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const paymentCntrl = {};

paymentCntrl.pay = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    // const body = _.pick(req.body, ['oprice', 'oid', 'secretcode', 'cid']);
    // console.log('Received request body:', body);
    const body =req.body
    console.log("oprice",body.oprice)

    try {
        // Convert oprice to a number
        const amount = parseFloat(body.oprice);
        if (isNaN(amount) || amount <= 0) {
            console.error('Invalid amount:', body.oprice);
            return res.status(400).json({ error: 'Invalid amount' });
        }

        const amountInCents = Math.round(amount * 100);

        // Create a customer
        const customer = await stripe.customers.create({
            name: "Testing",
            address: {
                line1: 'India',
                postal_code: '517501',
                city: 'Tirupati',
                state: 'AP',
                country: 'US',
            },
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [{
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name:"secretCode"
                    },
                    unit_amount: amountInCents // Use converted amount
                },
                quantity: 1
            }],
            mode: "payment",
            success_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/failure",
            customer: customer.id
        });

        const payment = new Payment();
        payment.cid = body.cid;
        payment.transactionId = session.id;
        payment.oprice = amount; 
        payment.paymentType = "card";
        await payment.save();

        res.json({ id: session.id, url: session.url });
    } catch (err) {
        console.error('Stripe error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

paymentCntrl.successUpdate = async (req, res) => {
    try {
        const id = req.params.stripeId;
        const paymentRecord = await Payment.findOne({ transactionId: id });
        if (!paymentRecord) {
            console.error('Payment record not found for transaction ID:', id);
            return res.status(404).json({ error: 'Record not found' });
        }
        const body = _.pick(req.body, ['paymentStatus']);
        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: id }, { $set: { paymentStatus: 'successfully' } }, { new: true });
        const updatedOrder = await Request.findOneAndUpdate({ _id: updatedPayment.cid }, { $set: { status: 'completed' } }, { new: true });
        res.json(updatedPayment);
    } catch (err) {
        console.error('Error updating payment status:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

paymentCntrl.failedUpdate = async (req, res) => {
    try {
        const id = req.params.stripeId;
        const body = _.pick(req.body, ['paymentStatus']);
        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: id }, { $set: { paymentStatus: "failed" } }, { new: true });
        res.json(updatedPayment);
    } catch (err) {
        console.error('Error updating payment status:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

paymentCntrl.status=async(req,res)=>{
    try {
        const { cid } = req.params;
        const paymentRecord = await Payment.findOne({ cid });
        if (!paymentRecord) {
            return res.status(404).json({ error: 'Payment record not found' });
        }
        res.json({ paymentStatus: paymentRecord.paymentStatus });
    } catch (err) {
        console.error('Error fetching payment status:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = paymentCntrl;
