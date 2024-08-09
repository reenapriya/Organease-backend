const mongoose = require('mongoose');
const { Schema, model } = mongoose

const organSchema = new Schema({
    dName: {
        type: String,
        //     required: true
    },
    dAge: {
        type: Number,
        // required: true

    },
    dWeight: {
        type: String,
        // required:true
    },
    bloodType: {
        type: String,
        // required:true
    },
    organName: {
        type: String,
        // required:true
    },
    date: {
        preserveSDate: {
            type: Date,
        },
        // required:true},

        preserveEDate: {
            type: Date
        }
        // required:true}
    },
    status: {
        type: String,
        required: true
    },
    
    cid: {
        type: Schema.Types.ObjectId,
        ref: "CentreProfile"
    },
    oprice: {
        type: Number,
        //  required: true,
    },
    oid: {
        type: Schema.Types.ObjectId,
        ref: "Category"
    },
    secretCode:{
        type:String,
        required :true
    },
    requestBy:[{type :Schema.Types.ObjectId, ref:"Hospital"}],
    isRequested: { type: Boolean, default: false },
    


})
const Organ = model("Organ", organSchema)
module.exports = Organ