const  categoryValidation=({
    catName:{
        exists:{
            errorMessage:"category is mandatory"
        },
        notEmpty:{
            errorMessage:"category is not empty"
        }
        ,trim:true
    }
})

module.exports=categoryValidation