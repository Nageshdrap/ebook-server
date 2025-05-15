const express = require('express');
const Wishlist = require("../models/wishlist");
const jwt = require('jsonwebtoken');
const verifyToken = require("../middlewares/authMiddleware");
const router = express.Router();


router.post('/wishlist',verifyToken, async (req,res) =>{
    try {
        const userId = req.userId;
        
        const productId = req.body.productId;
        
        const wishlist = await Wishlist.findOne({userId});
        
        if(!wishlist){
            const wishlist = new Wishlist({userId:userId,productId:[productId]});
          
            await wishlist.save();
        }else{
            if(!wishlist.productId.includes(productId)){
                wishlist.productId.push(productId);
            }
            
            await wishlist.save();
        }
        res.json({msg:'Product added successfully'});
       
        console.log(wishlist,"wishitem");
    } catch (error) {
        console.log(error);
    }
});

router.get("/wishlist", verifyToken , async (req,res)=>{
    try {
        const userId = req.userId;
        const wishlist = await Wishlist.findOne({userId}).populate("productId");
        res.json({list:wishlist.productId});
    } catch (error) {
        
    }
});

router.delete("/wishlist/:id", verifyToken , async (req,res)=>{
    try {
        const userId = req.userId;
        const productId = req.params.id;
        const wishlist = await Wishlist.findOne({userId});
        if(wishlist){
            wishlist.productId=wishlist.productId.filter(id => id.toString() !== productId);
            await wishlist.save();
        }
        res.json({msg:'product removed from Wishlist'});
    } catch (error) {
        
    }
})

module.exports = router;



