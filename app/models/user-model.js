const mongoose = require("mongoose")
const { Schema, model } = mongoose


const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    confirmPassword: {
        type: String,
        ref: "password"
    },
    role: String,
    resetPasswordToken: String, // Field to store the reset token
    resetPasswordExpires: Date  // Field to store the token expiration time
}, { timestamps: true })

const User = model("User", userSchema)

module.exports = User