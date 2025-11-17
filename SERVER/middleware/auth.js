const jwt=require('jsonwebtoken')
require ('dotenv').config()
exports.authuser=(req,res,next)=>{
    console.log("auth user middlewarre triggered");
    console.log("data:" ,req.headers.authorization);
    const token=req.cookies?.token ||req.headers.authorization?.split(' ')[1] //optional chaining
    console.log(token);
    if(!token)
    {
        return res.status(400).json({message:"authentication required"})
}
try{
    const verified=jwt.verify(token,process.env.secretkey)
    req.user=verified
    console.log(req.user);
    next()

}
catch(err){
    res.status(500).json({message:err.message})
}
}
exports.authorizeRoles=(...roles)=>{
    console.log(roles);
    return(req,res,next)=>{
        if(!req.user){
            return res.status(401).json({message:"please login"})
        }
        if(!roles.includes(req.user.usertype)){
            return res.status(400).json({message:"access denied"})
        }
        next()
    }
}