const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

const authenticateUser = async (req, res, next) => {
  const token = req.headers["authorization"]; // Get the token directly from the request

  if (!token) { // If no token is found
    return res.status(400).json({ errors: "Token is required" });
  }

  try {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET); // Verify the token directly

    const user = await User.findById(tokenData.id); // Find the user with this token data
    if (!user) {
      return res.status(400).json({ errors: "Invalid token" });
    }

    req.user = user; // Attach the user to the request
   // req.user_id = user._id;//Set req.user_id for further usage
    console.log("Authenticated User:", req.user); // Print the user info

    next(); // Let the request continue
  } catch (e) {
    return res.status(400).json({ error: e.message }); // If something goes wrong, show an error
  }
};

module.exports = authenticateUser; // Make this function available to use elsewhere







// const jwt =require("jsonwebtoken")

// const authenticateUser=(req,res,next)=>{
//     const token=req.headers["authorization"]

//     if(!token){
//         return res.status(400).json({errors:"token is required"})
//     }
//     try{
//         const tokenData=jwt.verify(token,process.env.JWT_SECRET)
//         req.user=tokenData
//         next()
//     }
//     catch(e){
//         return res.status(400).json({error:e})
//     }
// }

// module.exports=authenticateUser