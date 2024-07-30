const Patient = require("../models/patient-models");
const Hospital = require("../models/hospital-model");
const { validationResult } = require("express-validator");



const patientCtrl = {};

patientCtrl.create = async (req, res) => {
    const errors = validationResult(req);
    console.log("errors",errors)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        // const id=req.params.id
        const {pName,pAddress,docName}   = req.body;
        
    
          const hospital=await Hospital.findOne({userId:req.user._id,})
            const patient = new Patient({
                pName,
                pAddress,
                   
                docName,
                hid:hospital._id
                //patientCondition
                
            });

            await patient.save();
            return res.status(201).json(patient);
        }
    catch (e) {
        console.log(e);
        return res.status(500).json("Internal server error");
    }
};

patientCtrl.showOne=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const {hid}=req.params
    try{
        const hospital=await Hospital.findOne({userId:req.user._id})
        const patient=await Patient.findOne({_id:id,hid:hospital._id})
        return res.status(201).json(patient)
    }
    catch(e){
        console.log(e)
        return res.status(500).json("internal errors")
    }
}

patientCtrl.update=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const {id}=req.params
    const body=req.body
    try{
        const hospital=await Hospital.findOne({userId:req.user._id})
        const patient=await Patient.findOneAndUpdate({_id:id,hid:hospital._id},body,{new:true})
        return res.status(201).json(patient)
    }
    catch(e){
        console.log(e)
        return res.status(500).json("internal errors")
    }
}

patientCtrl.remove=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const {id}=req.params
    try{

       
    
        const hospital=await Hospital.findOne({userId:req.user._id})
        const patient=await Patient.findOneAndDelete({_id:id,hid:hospital._id})
        return res.status(201).json(patient)
    }
    catch(e){
        console.log(e)
        return res.status(500).json("internal errors")
    }

}

patientCtrl.showAll=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
        //const {hid}=req.params

        const hospital=await Hospital.findOne({userId:req.user._id})
        const patient=await Patient.find({hid:hospital._id})
        return res.status(201).json(patient)
       

}
catch(e){
  console.log(e)
  return res.status(500).json("internal errors")
}}

module.exports = patientCtrl;
