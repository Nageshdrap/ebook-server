const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../models/User');


const router = express.Router();


router.get('/user', authMiddleware , async (req,res)=>{
    try {
        const user = await User.findById(req.userId).select('-cpassword');
        if(!user) return res.status(400).json({message:'user not found'});

        res.json({user});
        console.log(user);

    } catch (error) {
        res.status(500).json({message:'user not fetched'});
    }
})

module.exports = router;