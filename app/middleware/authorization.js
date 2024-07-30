const authorizeUser=(permission)=>{
    return (req,res,next)=>{
        if(permission.includes(req.user.role)){
            next()
        }
        else{
            res.status(403).json({errors:"you dont have permission to access "})
        }
    }
}

module.exports=authorizeUser