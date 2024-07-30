const User=require("../models/user-model")
const centreValidation=({
    cEmail:{
       custom :{
            options:async(value)=>{
                const user=await User.findOne({email:value})
                if(user){
                    throw new Error("email is already present")
                }
                else{
                    return true
                }
            }
        }

    },
    contact:{
        isLength:{
            options:{min:0,max:10},
            errorMessage:"should you give ph no untill 10 digits"
        },
        notEmpty:{
            errorMessage:"ph number is not empty"
        },
        exists:{
            errorMessage:" ph number is required"
        },
        trim :true
    },
    // address:{
    //     exists:{
    //         errorMessage:"address is mandatory"
    //     },
    //     notEmpty:{
    //         errorMessage:"address is not empty"
    //     },
    //     trim:true
    // }
})
module.exports=centreValidation