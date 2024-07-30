const mongoose = require("mongoose")
const { Schema, model } = mongoose


const patientSchema = new Schema({
    pName: {
        type: String,
        required: true
    },
    pAddress: {
        type: String,
        required: true

    },
    docName: {
        type: String,
        required: true
    },
    patientCondition: {
        type: String,
       // required: true
    },
    hid: {
        type: Schema.Types.ObjectId,
        ref: "Hospital"
    }
})
const Patient = model("Patient", patientSchema)
module.exports = Patient