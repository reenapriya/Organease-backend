const Payment=require("../models/payment-model")
const CentreProfile=require("../models/Centre-model")
const Organ=require("../models/organ-model")
const sendMail=require('../../utils/nodeMailer')
const _= require('lodash')

const paymentCtrl={}

paymentCtrl.pay=async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
   
    const body = _.pick(req.body,['oid','cid','hid','amount'])
    try {
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
                        name: 'organ name'
                    },
                    unit_amount: body.totalAmount  * 100 
                },
                quantity: 1
            }],
            mode: "payment",
            success_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/failure",
            customer: customer.id
        });
        const payment = new Payment();
        payment.oid= body.oid,
        payment .hid=body.hid,
        payment.cid=body.cid
        payment.transactionId = session.id;
        payment.amount = Number(body.amount); 
        payment.paymentType = "card";
        await payment.save();

        res.json({ id: session.id, url: session.url });
}catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
}}


paymentCntrl.successUpdate=async(req,res)=>{
    try{
        const id = req.params.id
        const paymentRecord = await Payment.findOne({transactionId:id})
        if(!paymentRecord){
            return res.status(404).json({error:'record not found'})
        }
        const body = pick(req.body,['paymentStatus'])
        const updatedPayment = await Payment.findOneAndUpdate({transactionId:id}, {$set:{paymentStatus:'Successful'}},{new:true})
        const updatedOrder = await CentreProfile.findOneAndUpdate({_id:updatedPayment.cid},{$set:{status:'completed'}},{new:true})
        res.json(updatedPayment)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}
paymentCntrl.failedUpdate=async(req,res)=>{
    try{
        const id = req.params.id
        const body = _.pick(req.body,['paymentStatus'])
        const updatedPayment = await Payment.findOneAndUpdate({transactionId:id},{$set:{paymentStatus:"Failed"}},{new:true}) 
        res.json(updatedPayment)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}




module.exports=paymentCntrl