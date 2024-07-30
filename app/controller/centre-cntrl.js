const User = require("../models/user-model")
const CentreProfile = require("../models/Centre-model");
const { validationResult } = require("express-validator");
const uploadToCloudinary=require("../../utils/cloudinary")
const upload=require("../middleware/multer")
const _=require("lodash")

const centreCtrl = {};

centreCtrl.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  
   
 
  try {
    const { contact, address, license } = req.body;
    
    const newCentre = new CentreProfile({
      userId: req.user._id,  // Ensure userId is being set
      cName: req.user.name,  // Ensure cName is being set
      cEmail: req.user.email,  // Ensure cEmail is being set
      contact,
      address: {
        doorNo: address.doorNo,
        street: address.street,
        city: address.city,
        state: address.state,
        country: address.country,
        postalCode: address.postalCode
      },
      license
      });
      
      console.log("newcentre",newCentre)
      if (req.file) {
        console.log('File received:', req.file);
        const body = _.pick(req.body, ['license'])
        const photoOptions = {
            folder: 'license-/lice',
            quality: 'auto',
        };
        const photoResult = await uploadToCloudinary(req.file.buffer, photoOptions);
        console.log('Upload result:', photoResult);
        console.log('Uploaded photo:', photoResult.secure_url);
        newCentre.license = photoResult.secure_url;
    }
      
  

    await newCentre.save();
    return res.status(201).json(newCentre);
  } catch (e) {
    console.log(e);
    return res.status(500).json("Internal server error");
  }
};

centreCtrl.show = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  try {
    const centre = await CentreProfile.find()
    return res.status(201).json(centre)
  }
  catch (e) {
    console.log(e)
    return res.status(500).json("internal error")
  }
}
centreCtrl.showOne = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  const cid = req.params.cid
  try{

    let centre;
    if (req.user.role === 'Centre') {
      // Centre users can only access their own center
      centre = await CentreProfile.findOne({ _id: cid });
    } else if (req.user.role === 'Hospital') {
      // Hospital users can access any center
      centre = await CentreProfile.findById(cid);
      console.log("cid",cid)
    }

    if (!centre) {
      return res.status(404).json({ message: "Centre not found" });
    }
    

    return res.status(200).json(centre);
   
}
  catch (e) {
    console.log(e)
    return res.status(500).json("internal error")

  }
}




// Existing code...

centreCtrl.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const id = req.params.id;
  const { cName, cEmail, contact, address, license } = req.body;

  try {
    const updateFields = {
      contact,
      address: {
        doorNo: address.doorNo,
        street: address.street,
        city: address.city,
        state: address.state,
        country: address.country,
        postalCode: address.postalCode
      },
      license
    };

    if (cName) {
      updateFields.cName = cName;
    }
    if (cEmail) {
      updateFields.cEmail = cEmail;

      // Update User model's email as well
      await User.updateOne({ _id: req.user._id }, { email: cEmail, name: cName });
    }

    const updatedCentre = await CentreProfile.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      updateFields,
      { new: true }
    );

    if (!updatedCentre) {
      return res.status(404).json({ errors: "Centre not found" });
    }

    return res.status(200).json(updatedCentre);
  } catch (e) {
    console.log(e);
    return res.status(500).json("Internal server error");
  }
};

centreCtrl.delete = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })

  }

  const id = req.params.id;
  try {
    // Delete the user by their ID
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the centre profile associated with the user ID
    const centre = await CentreProfile.findOneAndDelete({ userId: id });

    // Return success message
    return res.status(200).json({ message: 'User and associated centre profile deleted successfully' });
  }
  catch (e) {
    console.log(e)
    return res.status(500).json("internal errors")
  }
}

 centreCtrl.myshow=async(req,res)=>{
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })

  }
  try{
  const centre=await CentreProfile.findOne({userId:req.user._id})
  return res.status(201).json(centre)

 }
 catch(e){
  console.log(e)
  return res.status(500).json("internal errors")
 }
 }
module.exports = centreCtrl;



