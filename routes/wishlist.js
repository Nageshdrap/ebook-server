const express = require('express');
const Wishlist = require("../models/wishlist");
const jwt = require('jsonwebtoken');
const verifyToken = require("../middlewares/authMiddleware");
const router = express.Router();


router.post('/addwishlist',verifyToken, async (req,res) =>{
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

router.get("/getwishlist", verifyToken , async (req,res)=>{
    try {
        const userId = req.userId;
        const wishlist = await Wishlist.findOne({userId}).populate("productId");
        res.json(wishlist.productId);
        console.log("Wishlist nag",wishlist.productId);
    } catch (error) {
        res.json({msg:'wishlist getting failed'});
    }
});

router.delete("/deletewishlist/:productId", verifyToken , async (req,res)=>{
    try {
        const userId = req.userId;
        const productId = req.params.productId;
        const wishlist = await Wishlist.findOne({userId});
        if(wishlist){
            wishlist.productId=wishlist.productId.filter(id => id.toString() !== productId);
            await wishlist.save();
        }
        res.json({msg:'product removed from Wishlist'});
    } catch (error) {
                res.json({msg:'wishlist getting failed'});

    }
})

module.exports = router;



