const User=require("../models/user-model")
const Hospital=require("../models/hospital-model")
const hospitalValidation=({
    hName:{
        custom :{
            options:async(value,{req})=>{
                const userId=req.user._id
                console.log(userId)
                const user = await User.findById(userId);
         const hospital = await Hospital.findOne({ hName: value });

    if (!user) {
      throw new Error('User not found');
    }

    if (!hospital) {
      throw new Error('Hospital with the given hName not found');
    }

    // Check if the names match
    if (user.name !== hospital.hName) {
      throw new Error('User name does not match Hospital hName');
    }

    return true;


            }
        }
    },
    hEmail:{
        custom :{
            options:async(value,{req})=>{
                const user=await User.findById(req.body.userId)
                const hospital=await Hospital.findOne({hEmail:value})
                try {
                    if(!user){
                        throw new Error("user is  not found")
                    }
                    if(!hospital){
                        throw new Error("hospital is not found")
                    }

                    if(user.email!==hospital.hEmail){
                        throw new Error("user email is not match to hospital email")
                    }
                    return true
                }
                catch(e){
                    console.log(e)
                }

            }
        }
    },
    authCertificate:{
        notEmpty:{
            errorMessage: "authCertificate is not empty"
        },
        exists:{
            errorMessage:" authCertificate is mandatory"
        },
        trim:true
    }

})

module .exports=hospitalValidation


