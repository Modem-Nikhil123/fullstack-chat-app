const jwt = require('jsonwebtoken');

const createToken=(userId,res)=>{
    const token=jwt.sign({userId},process.env.SECRET_KEY,{
        expiresIn:'7d'
    })
    res.cookie('jwt',token,{
        httpOnly:true,
        sameSite:'Lax',
        secure:process.env.NODE_ENV!=="development",
        maxAge:7*24*60*60*1000
    })
}
module.exports=createToken;