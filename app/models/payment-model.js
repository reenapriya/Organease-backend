const mongoose=require("mongoose")
const {Schema,model}=mongoose


const paymentSchema= new Schema({
    hid:{
        type:Schema.Types.ObjectId,
        ref:"Hospital"
    },
    oid:{
        type:Schema.Types.ObjectId,
        ref:"Organ"
    },
    cid:{
        type:Schema.Types.ObjectId,
        ref:"CentreProfile"
    },
    
    paymentType: String,
    amount: Number,
    
    transactionId: {
        type:String,
        default:false
    },
    paymentStatus:{
        type:String,
        enum:['pending','success','failure'],
        default:'pending'
    }


})

const Payment=model("Payment",paymentSchema)
module.exports=Payment