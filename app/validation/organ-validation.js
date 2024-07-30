const organValidation=({
    dName:{
        exists:{
            errorMessage:"category is mandatory"
        },
        notEmpty:{
            errorMessage:"category is not empty"
        }
        ,trim:true
    },

    dAge:{
       isLength:{
        option:{min:1,max:2}
       },
       isNumeric:{
         errorMessage:"you should give only numbers here"
       },
       notEmpty:{
        errorMessage:"not empty"
       },
       exists:{
        errorMessage:"Age is mandatory"
       },
       custom:{
        options:async(value)=>{
            if(value <=18){
                throw new Error(" age should be greater than 18")
            }
            else{
                return true
            }

        }
       }
    },
    dWeight:{
         isNumeric:{
         errorMessage:"you should give only numbers here"
       },
       notEmpty:{
        errorMessage:"not empty"
       },
       exists:{
        errorMessage:"weight is mandatory"
       },
       custom:{
        options:async(value)=>{
            if(value <=50){
                throw new Error(" weight should be greater than 50")
            }
            else{
                return true
            }

        }
       }

    },
    bloodType:{
        notEmpty:{
            errorMessage:"not empty"
           },
           exists:{
            errorMessage:"weight is mandatory"
           },
           trim :true

    },
    
    
    "date.preserveSDate":{
        notEmpty:{
            errorMessage:"not empty"
           },
           exists:{
            errorMessage:"weight is mandatory"
           },
           trim :true,
        },
           
   "date.preserveEDate":{
    notEmpty:{
        errorMessage:"not empty"
       },
       exists:{
        errorMessage:"End Date is mandatory"
       },
       trim :true,
       custom: {
        options: (value, { req }) => {
            const preserveSDate = new Date(req.body.date.preserveSDate);
            const preserveEDate = new Date(value);
            if (preserveEDate <= preserveSDate) {
                throw new Error("Preserve end date should be greater than preserve start date");
            }
            return true;
        }
    }
},

   
   status:{
   
    exists:{
      errorMessage:"status is mandatory"
    },
    in:"body",
    
    isIn :{
        options:[["Active","InActive","active","inactive"]],
        
      errorMessage: "Invalid status"}
   },
   oCertificate:{
    
    notEmpty:{
        errorMessage:"not empty"
       },
       exists:{
        errorMessage:"certificate is mandatory"
       },
       trim :true,
   },
   oprice:{
    isNumeric:{
        errorMessage:"should you  give numbers only"
    },
    notEmpty:{
        errorMessage:"not empty"
       },
       exists:{
        errorMessage:"price is mandatory"
       },
       trim :true,
    
   }

})
module.exports=organValidation

 