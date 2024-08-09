const { validationResult } = require("express-validator");
const CentreProfile = require("../models/Centre-model"); // Adjust the import based on your model setup
const Category = require("../models/category-models"); // Adjust the import based on your model setup

const categoryCtrl = {};

categoryCtrl.create = async (req, res) => {
  

  try {
    // Assuming req.user._id contains the User ID of the authenticated user
    // Fetch Centre Profile using the User ID (req.user._id)
    const centreProfile = await CentreProfile.findOne({ userId: req.user._id });

    if (!centreProfile) {
      return res.status(404).json({ error: "Centre Profile not found" });
    }

    // Now you have the Centre Profile object, extract _id as cid for the category
    const cid = centreProfile._id;

    // Create new category with cid set to Centre Profile ID
    const newCategory = new Category({
      catName: req.body.catName,
      cid: cid,
      // Add other fields as needed
    });

    await newCategory.save();

    return res.status(201).json(newCategory);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

categoryCtrl.show=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
       
      const centreProfile = await CentreProfile.findOne({ userId: req.user._id });

    if (!centreProfile) {
      return res.status(404).json({ error: "Centre Profile not found" });
    }

    // Now you have the Centre Profile object, extract _id as cid for the category
    const cid = centreProfile._id;

  
   
    const category=await Category.find( {cid :cid})
    return res.status(201).json(category)
    }
    catch(e){
        console.log(e)
        return res.status(500).json("internal errors")
    }
   
}
categoryCtrl.showOne=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
        const centreProfile = await CentreProfile.findOne({ userId: req.user._id });

    if (!centreProfile) {
      return res.status(404).json({ error: "Centre Profile not found" });
    }

    // Now you have the Centre Profile object, extract _id as cid for the category
    const cid = centreProfile._id;
    const id=req.params.id
    const category=await Category.findOne({_id:id,cid:cid})
    return res.status(201).json(category)
}
catch(e){
    console.log(e)
    return res.status(500).json("internal errors")
}

}
categoryCtrl.update=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
        const centreProfile = await CentreProfile.findOne({ userId: req.user._id });

    if (!centreProfile) {
      return res.status(404).json({ error: "Centre Profile not found" });
    }

    // Now you have the Centre Profile object, extract _id as cid for the category
    const cid = centreProfile._id;
    const id=req.params.id
    const body=req.body
    const category=await Category.findOneAndUpdate({_id:id,cid:cid},body,{new:true})
    return res.status(201).json(category)

}
catch(e){
    console.log(e)
    return res.status(500).json("internal errors")
}
}

categoryCtrl.delete=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
        const centreProfile = await CentreProfile.findOne({ userId: req.user._id });

    if (!centreProfile) {
      return res.status(404).json({ error: "Centre Profile not found" });
    }

    // Now you have the Centre Profile object, extract _id as cid for the category
    const cid = centreProfile._id;
    const id=req.params.id
    const category=await Category.findOneAndDelete({_id:id,cid:cid})
    return res.status(201).json(category)
}

catch(e){
    console.log(e)
    return res.status(500).json("internal errors")
}
}

categoryCtrl.myshow=async(req,res)=>{
  const errors=validationResult(req)
  if(!errors.isEmpty()){
      return res.status(400).json({errors:errors.array()})
  }
  try{
      const centreProfile = await CentreProfile.findOne({ userId: req.user._id });

  if (!centreProfile) {
    return res.status(404).json({ error: "Centre Profile not found" });
  }

  // Now you have the Centre Profile object, extract _id as cid for the category
  const cid = centreProfile._id;
  //const id=req.params.id
  const category=await Category.find({cid:cid})
  return res.status(201).json(category)
  }
  catch(e){
      console.log(e)
      return res.status(500).json("internal errors")
  }
 
}

module.exports = categoryCtrl;
