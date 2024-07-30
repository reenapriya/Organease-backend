const mongoose = require("mongoose")
const { Schema, model } = mongoose

const categorySchema = new Schema({
    catName: String,

    cid: {
        type: Schema.Types.ObjectId,
        ref: "CentreProfile"
    }
})

const Category = model("Category", categorySchema)

module.exports = Category