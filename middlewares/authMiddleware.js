const jwt = require('jsonwebtoken');


const jwtsecret = "nagesh@8658vchbjbsbcvbksdjvdsbjvjsbvksjbvksfbvkjsJSBvkjdbfvkfs";

const authMiddleware = (req,res,next) =>{
    const token = req.headers.authorization?.split(" ")[1];
    console.log('auth' + token);
    if(!token){
        return res.status(401).json({message:'invalid to'});
    }

    jwt.verify(token,jwtsecret,(err , decoded)=>{
        if(err) return res.status(400).json({message:'invalid token'});
        req.userId = decoded.userId;
        next();
    });


};

module.exports = authMiddleware;