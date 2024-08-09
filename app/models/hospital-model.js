const mongoose = require("mongoose")
const { Schema, model } = mongoose

const hospitalSchema = new Schema({
    hName: {
        type: String,
        required: true
    },
    hEmail: {
        type: String,
        ref: "User"
    },
   

    place: {
        type: String,
        required: true
    },

    contact: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

const Hospital = model("Hospital", hospitalSchema)
module.exports = Hospital