const express = require('express');
const Cart = require('../models/cart');
const jwt = require('jsonwebtoken');
const verifyToken = require("../middlewares/authMiddleware");
const Coupon = require('../models/coupon');

const router = express.Router();

router.post('/add', verifyToken , async (req , res) =>{
    
        const { productId , quantity} = req.body;
        const userId = req.userId;
        
    try {
           let cart = await Cart.findOne({userId});

           if(!cart) {
             cart = new Cart({userId , items : [{productId , quantity}]});
           }else{
            const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
            if(itemIndex > -1){
              cart.items[itemIndex].quantity +=quantity;
            }else{
              cart.items.push({productId , quantity});
            }
           }
           await cart.save();
           res.status(200).json({msg:"cart added successfully"});
    } catch (error) {
        res.status(500).json({msg:"cart added failed"});
    }
});

router.get('/cartitems',verifyToken , async (req, res)=>{
  try {
    console.log("user id:" , req.userId);
    const cart = await Cart.findOne({userId : req.userId}).populate("items.productId");
    console.log("user check",cart);
    if(!cart){
      console.log("no cart found for user");
      return res.json({message: "cart is empty", items:[]});
    }
    console.log("populated cart:", JSON.stringify(cart , null , 2));
    let total=0;

      cart.items.forEach(item => {
        total += item.productId.price * item.quantity;
        
      });

      res.json({cart:cart,total:total});
    
  } catch (error) {
    console.log("error in fetching");
    res.status(500).json({message: "cart getting failled"});
  }
});

router.put('/update/:id', verifyToken , async(req, res) =>{
    const {quantity , couponValue} = req.body;
    const userId = req.userId;
    const productId = req.params.id;
    console.log("cart userid" , userId);
    console.log("coupon",couponValue);
    try {
      const cart = await Cart.findOne({userId}).populate("items.productId");
      // const cart = await Cart.findOne({userId}).populate("items.productId");

      
      if(!cart) {return res.status(400).json({msg:'cart not found'})};

      const itemIndex = cart.items.findIndex((item) => item.productId._id.toString() === productId);
      console.log("index", itemIndex);
      if(itemIndex > -1){
        cart.items[itemIndex].quantity=quantity;
       
      }
      let total=0;
      cart.items.forEach(item => {
        total += item.productId.price * item.quantity;
        
      });
      await cart.save();
      if(couponValue){
        const coupon = await Coupon.findOne({code:couponValue.toUpperCase()});
      
        if(!coupon) return res.json({msg:'Invalid coupon '});
        if(coupon.expiresAt < new Date()) return res.json({msg:'coupon expired'});

        const discountAmount =Math.round((coupon.discount/100)*total) ;
        const discountedTotal = total - discountAmount;
        res.json({cart:cart,total:total,discountAmount,discountedTotal});
      }else{
      res.json({cart:cart,total:total});
      }
      // console.log(total,"total",discountAmount,discountedTotal);
      
    } catch (error) {
      res.status(500).json({error:"error updating cart"});
    }
})

router.delete("/remove/:id" , verifyToken , async(req, res)=>{
  try {
    const productId = req.params.id;
    
   
    const userId = req.userId;
    const cart = await Cart.findOne({userId}).populate("items.productId");
      
      if(!cart) {return res.status(400).json({msg:'cart not found'})};

      cart.items = cart.items.filter(item => item.productId._id.toString() !== productId);
      await cart.save();
      

      res.json({cart});
  } catch (error) {
    res.status(500).json({msg:'server error'});
  }
})

module.exports = router;
