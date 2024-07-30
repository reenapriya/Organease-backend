
const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const addressSchema = new Schema({
  doorNo: { type: String}, 
    //required: true },
  street: { type: String},
    // required: true },
  city: { type: String}, 
    //required: true },
  state: { type: String}, 
    //required: true },
  country: { type: String },
    //required: true },
  postalCode: { type: String}, 
    //required: true }
});

const centreSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  cName: {
    type: String,
    required: true,
    ref: "User"
  },
  cEmail: {
    type: String,
    required: true,
    ref: "User"
  },
  contact: {
    type: Number,
    required: true
  },
  address: {
    type: addressSchema,
   required: true
  },
  license: {
    type: String,
   
  }
});

const CentreProfile = model("CentreProfile", centreSchema);

module.exports = CentreProfile;
