const Joi=require("joi")
const validator=(schema)=>payload=>
    schema.validate(payload,{abortEarly:false})

const SignUpSchema=Joi.object({
    name: Joi.string().required(),
        
        
    email:Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]{3,30}$')).required().messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number.'
    }),
    confirmPassword:Joi.ref("password"),
    role:Joi.string().valid("Centre","Hospital")

})

const loginSchema=Joi.object({
    email:Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]{3,30}$')).required().messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number.'
    }),
})

module.exports={
     validateSignup:validator(SignUpSchema),
    validateLogin:validator(loginSchema)}