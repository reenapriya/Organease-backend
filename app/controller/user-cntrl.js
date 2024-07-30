const User=require("../models/user-model")
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcryptjs=require("bcryptjs")
const _=require("lodash")
const jwt=require("jsonwebtoken")
const {validateSignup, validateLogin}=require("../validation/user-validation");
const { validationResult } = require("express-validator");

const userCtrl={}

userCtrl.register=async(req,res)=>{
    const {error,value}=validateSignup(req.body)
    if(error){
        console.log(error)
        return res.status(400).json({errors:error.details})
    }
     const body=req.body
     try{
        const salt=await bcryptjs.genSalt()
        const hashPassword=await bcryptjs.hash(body.password,salt)
        const user=new User(body)
        user.password=hashPassword
        user.confirmPassword=user.password
        await user.save()
        return res.status(200).json(user)
     }
     catch(e){
        return res.status(500).json("internal errors")
     }
}

userCtrl.login=async(req,res)=>{
    const body=_.pick(req.body,["email","password"])
    const {error,value}=validateLogin(body)
    if(error){
        console.log(error)
        return res.status(400).json({errors:error.details})
    }
    
    try{
        const user=await User.findOne({email:body.email})
        if(user){
            const isAuth=await bcryptjs.compare(body.password,user.password)
            if(isAuth){
                const tokenData={
                    id:user._id,
                    role:user.role}
                    const token=jwt.sign(tokenData,process.env.JWT_SECRET,{expiresIn:"7d"})
                    return res.status(200).json({token:token})
                }
                return res.status(404).json("invalid email/password")
            }
        }
        catch(e){
            console.log(e)
            return res.status(500).json("internal error")
        }
    }

userCtrl.account=async(req,res)=>{
    try{
        const user=await User.findById(req.user.id)
        res.json(user)
    }
    catch(e){
        console.log(e)
        res.status(500).json("internal error")
    }
}

// userCtrl.forgotPassword = async (req, res) => {
//     const { email } = req.body;

//     try {
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ message: "No user with that email address." });
//         }

//         const token = crypto.randomBytes(20).toString('hex');

//         user.resetPasswordToken = token;
//         user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

//         await user.save();

//         const transporter = nodemailer.createTransport({
//             service: 'Gmail',
//             auth: {
//                 user: process.env.EMAIL_ADDRESS,
//                 pass: process.env.EMAIL_PASSWORD
        //     }
        // });

        // const mailOptions = {
        //     to: user.email,
        //     from: process.env.EMAIL_ADDRESS,
        //     subject: 'Password Reset',
        //     text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
        //         `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
        //         `http://${req.headers.host}/reset/${token}\n\n` +
        //         `If you did not request this, please ignore this email and your password will remain unchanged.\n`
        // };

        // await transporter.sendMail(mailOptions);

//         res.status(200).json({ message: 'An e-mail has been sent to ' + user.email + ' with further instructions.' });
//     } catch (error) {
//         console.log(error.message)
//         res.status(500).json({ message: 'Internal error.' });
//     }
// };


// userCtrl.resetPassword = async (req, res) => {
//     const { token, newPassword } = req.body;

//     try {
//         const user = await User.findOne({
//             resetPasswordToken: token,
//             resetPasswordExpires: { $gt: Date.now() }
//         });

        // if (!user) {
//             return res.status(400).json({ message: "Password reset token is invalid or has expired." });
//         }

//         const salt = await bcryptjs.genSalt();
//         user.password = await bcryptjs.hash(newPassword, salt);
//         user.confirmPassword = user.password;
//         user.resetPasswordToken = undefined;
//         user.resetPasswordExpires = undefined;

//         await user.save();

//         res.status(200).json({ message: 'Password has been reset successfully.' });
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ message: 'Internal error.' });
//     }
// };




userCtrl.forgotPassword=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
      const {email}=req.body
       const user=await User.findOne({email:email})
    try{
       if(!user){
        return res.json("user is not existed")
       }
       const tokenData={
        id:user._id,
        role:user.role}
        const token=jwt.sign(tokenData,process.env.JWT_SECRET,{expiresIn:"1d"})

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_ADDRESS,
              pass: process.env.EMAIL_PASSWORD
            }
          });
          
          var mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: 'r@gmail.com',
            subject: 'Reset your password Link',
            text: `http://localhost:3000/reset-password/${user._id}/${token}`
          };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
             return res.json("successfully")
            }
          });
    }
    catch(e){
        return res.status(500).json('internal errors')
    }
}

userCtrl.resetPassword=async(req,res)=>{
    
}




module.exports=userCtrl