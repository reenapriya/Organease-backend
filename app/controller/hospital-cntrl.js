//const mongoose = require('mongoose');
const User=require("../models/user-model")
const Hospital = require("../models/hospital-model");
const { validationResult } = require("express-validator");
const _ = require("lodash");
//const { ObjectId } = mongoose.Types

const hospitalCtrl = {};

hospitalCtrl.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { authCertificate ,contact,place} = req.body;
    const body = _.pick(req.body, ["hName", "hEmail", "authCertificate", "userId","place","contact"]);
    const hospital = new Hospital({
      hName: req.user.name,
      hEmail: req.user.email,
      userId: req.user._id,
      authCertificate,
      place,
      contact
    });
    console.log("hospital", hospital);
    await hospital.save();
    return res.status(201).json(hospital);
  } catch (e) {
    console.log(e);
    return res.status(500).json("Internal Server Error");
  }
}
hospitalCtrl.show=async(req,res)=>{
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try{
     const hid=req.params.hid
    const hospital=await Hospital.findOne({userId:req.user._id})
    return res.status(200).json(hospital)

  }
  catch(e){
    console.log(e)
    return res.status(500).json("internal errors")
  }


}

hospitalCtrl.myShow=async(req,res)=>{
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try{
   // const {hid}=req.params

    const hospital=await Hospital.findOne({userId:req.user._id})
    if(!hospital){
      return res.status(400).json("hospital deosnot found")
    }
    return res.status(201).json(hospital)

}
catch(e){
  console.log(e)
  return res.status(500).json("internal errors")
}
}


hospitalCtrl.update = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const id = req.params.id;
    const {hName,hEmail,authCertificate,contact,place}  = req.body;

    console.log(`Received id: ${id}`);

  //   if (!ObjectId.isValid(id)) {
  //     return res.status(400).json({ errors: "Invalid ID format" });
  // }

    
    try {
        const updateFields = {
            authCertificate,
            place,
            contact
        };

        

        if (hName) {
            updateFields.hName = hName;
            // Update User model's name as well
            await User.updateOne({ _id: req.user._id }, { name: hName });
        }
        if (hEmail) {
            updateFields.hEmail = hEmail;
            // Update User model's email as well
            await User.updateOne({ _id: req.user._id }, { email: hEmail });
        }

        const updatedHospital = await Hospital.findOneAndUpdate(
            { _id:id , userId: req.user._id },
            updateFields,
            { new: true }
        );
        if (!updatedHospital) {
            return res.status(404).json({ errors: "Hospital not found" });
        }

        return res.status(200).json(updatedHospital);
    } catch (e) {
        console.log(e);
        return res.status(500).json("Internal Server Error");
    }

};

hospitalCtrl.delete=async(req,res)=>{
  const errors=validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
  }
  const id=req.params.id
  try{
   // Delete the user by their ID
   const user = await User.findByIdAndDelete(id);
   if (!user) {
       return res.status(404).json({ message: 'User not found' });
   }

   const hospital = await Hospital.findOneAndDelete({ userId: id });
        
   // Return success message
   return res.status(200).json({ message: 'User and associated centre profile deleted successfully' });
  }
  catch(e){
    console.log(e)
    return res.status(500).json("internal errors")
  }
}

hospitalCtrl.showAll=async(req,res)=>{
  const errors=validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
  }
  try{
    const hospital=await Hospital.find()
    return res.status(201).json(hospital)
  }
  catch(e){
    console.log(e)
    return res.status(500).json("internal errors")
  }
 
}

module.exports = hospitalCtrl;



