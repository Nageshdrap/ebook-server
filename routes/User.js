

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/authMiddleware');
const axios = require('axios');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const jwtsecret = "nagesh@8658vchbjbsbcvbksdjvdsbjvjsbvksjbvksfbvkjsJSBvkjdbfvkfs";

router.post("/register", async (req,res)=>{
    try{
       
        const {uname , email,cpassword , phone }= req.body;
        if( !uname || !email || !cpassword || !phone){
            return res.status(400).json({message:'all field are required'});
        }

        const userExist = await User.findOne({email});
        if(userExist){
            return res.status(400).json({message:'user already exists'});
        }
        const newUser = new User({uname,email,cpassword,phone});
        await newUser.save();


       res.json({message:'registerion successfully'});
    }catch(error){
        console.log(error);
        res.status(500).json({msg:"data send failed"});
    }
})

router.post("/login", async(req,res)=>{
    try{
       
        const {email , password} = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.json({success:false,message:'Invalid Email Id'});
        }
        
        if(password !== user.cpassword){
            return res.json({success:false,message:'invalid password'});
        }

        const token = jwt.sign({userId : user._id}, jwtsecret);
        res.cookie("token", token,{
            httpOnly:true,
            maxAge:24*60*60*1000,
        });
        
        res.json({success:true , message:'logged in successfully' ,token, userId: user._id});
        
    }catch(error){
        
        res.status(500).json({msg:"data send failed"});
    }

});

router.put('/login/update',verifyToken, async (req, res) =>{
    const userId = req.userId;
    try {
        const user =await User.findByIdAndUpdate(userId,req.body);
        user.save();
        console.log(user);
        res.json({msg:'update successfully'});

    } catch (error) {
        res.json({error:'update is failled'});
    }
});

router.post("/auth/google", async (req,res) =>{
    const { credential } = req.body;
    try {
        const googleResponse = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);

        const {sub, name , email} = googleResponse.data;
        let user = await User.findOne({googleId: sub});

        if(!user){
            user = new User({googleId:sub , uname:name , email});
            await user.save();
        }
        const token = jwt.sign({userId : user._id}, jwtsecret);
        res.json({success:true , message:'logged in successfully' ,token, userId: user._id});

    } catch (error) {
        
    }
})

module.exports = router;