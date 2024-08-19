const Request=require("../models/request-model")
const {validationResult}=require("express-validator")
const Patient =require("../models/patient-models")
const Hospital = require("../models/hospital-model")
const Organ=require("../models/organ-model")
const CentreProfile = require("../models/Centre-model")
const sendMail=require("../../utils/nodeMailer")


const requestCtrl={}

requestCtrl.create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { hid, oid } = req.body;

    try {
        // First, find the organ to check if it's already requested
        const organ = await Organ.findById(oid);
        
        if (!organ) {
            return res.status(404).json({ message: "Organ not found" });
        }
        
        if (organ.isRequested) {
            return res.status(400).json({ message: "Organ has already been requested" });
        }

        // Update the organ document: set isRequested to true and add hid to requestBy array
        const updatedOrgan = await Organ.findByIdAndUpdate(
            oid,
            {
                $addToSet: { requestBy: hid },
                isRequested: true
            },
            { new: true }
        );

        // Create and save the request document
        const requestPass = new Request(req.body);
        await requestPass.save();

        return res.status(201).json(requestPass);
    } catch (e) {
        console.log(e);
        return res.status(500).json("Internal server error");
    }
};


requestCtrl.show=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const {hid}=req.params
    //console.log("id",id)
   
    try{
        
        const requestPass=await Request.find({hid:hid})
        return res.status(201).json(requestPass)
    }
    catch(e){
        console.log(e)
        return res.status(500).json("internal errors")
    }
}

requestCtrl.showOne=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
        const {id}=req.params
        const requestpass=await Request.findOne({_id:id })
        return res.status(201).json(requestpass)
    }
    catch(e){
        console.log(e)
        return res.status(500).json("internal errors")
    }

}

requestCtrl.showForCentre=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const id=req.params.cid
   
    try{
        const requestPass=await Request.find({cid:id})
        return res.status(201).json(requestPass)
    }
    catch(e){
        console.log(e)
        return res.status(500).json("internal errors")
    }

}

requestCtrl.update=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    // const id=req.params.id
    // const body=req.body
    // try{
    //     const requestpass=await Request.findOneAndUpdate({_id:id},body,{new:true})
    //     return res.status(201).json(requestpass)
    // }
    const { id } = req.params;
  const { isApproved } = req.body;

  try {
    const request = await Request.findByIdAndUpdate(id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.isApproved = isApproved;
    await request.save();
     if(request.isApproved==true){

    const subject = 'Request Approved';
    const text = `Thank you for your request. Your request organ  secret code is ${request.secretCode}.
       AddressDetails : Get Address  details  from Click centre Name then you'll get centre address `;
    

     await sendMail(request.hospital.hEmail, subject, text);
    

    res.status(200).json({ message: 'Request updated and email sent' });}
    else{
        const subject = 'Request Approval is Cancelled';
    const text = `Sorry . Your request organ  secret code is ${request.secretCode}. approval is cancelled by centre 
       contact centre once`;
    

     await sendMail(request.hospital.hEmail, subject, text);
    

    res.status(200).json({ message: 'Request updated and email sent for rejection' });}
    

    }
    catch(e){
        console.log(e)
        return res.status(500).json("internal errors")
    }

}

requestCtrl.latest= async (req, res) => {
    try {
      const latestRequests = await Request.find()
        .sort({ createdAt: -1 }) // Sort by creation date in descending order
        .limit(3); // Limit to 3 requests
       return res.json(latestRequests);
    } catch (error) {
        console.log(error.message)
       return res.status(500).json({ message: 'Server error' });
    }
  };
  

module.exports=requestCtrl