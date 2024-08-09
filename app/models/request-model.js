const mongoose=require("mongoose")

const {Schema,model}=mongoose


const requestSchema= new Schema({
    hid :{
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
    isApproved:{
        type:Boolean,
        default:false
    },
    pid:{
        type:Schema.Types.ObjectId,
        ref:"Patient"
    },
    pName:{
        type:String,
        ref:"Patient"
    },
   hospital:{
    hName: {type:String},
    hEmail:{type:String},
    place:{type:String},
    contact:{type:String},

  
   },
   cName:{
    type:String,
    ref:"CentreProfile"
   },
   secretCode:{
    type:String,
    ref:"Organ"
   },
   oprice:{
    type:String,
    ref:"Organ"
   }

})

const Request=model("Request",requestSchema)
module.exports=Request