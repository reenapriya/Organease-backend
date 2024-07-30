const patientValidation={
    pName:{
        notEmpty:{
            errorMessage:"patient name is not empty"
        },
        exists:{
            errorMessage:"patient name is mandtory"
        },
        trim:true
    },
    // pAddress:{
    //     notEmpty:{
    //         errorMessage:"patient address is not empty"
    //     },
    //     exists:{
    //         errorMessage:"patient address is mandtory"
    //     },
    //     trim:true

    // },
    docName:{
        notEmpty:{
            errorMessage:"Doctor name is not empty"
        },
        exists:{
            errorMessage:"Doctor name is mandtory"
        },
        trim:true

    },
    // patientCondition:{
    //     notEmpty:{
    //         errorMessage:"prescription is not empty"
    //     },
    //     exists:{
    //         errorMessage:"prescriptionis mandtory"
    //     },
    //     trim:true
    // }
}

module.exports=patientValidation