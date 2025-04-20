const express = require('express');
const dotenv = require('dotenv').config();
const Razorpay = require('razorpay');
const router = express.Router();
const verfiryToken = require('../middlewares/authMiddleware');
const Order = require('../models/order');
const Cart = require('../models/cart');
const { default: mongoose } = require('mongoose');
const crypto = require('crypto');


const razorpay = new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
});

router.post('/order' , verfiryToken , async (req, res) => {
    try {
        const userId = req.userId;
        const {shipping , items , totalAmount , paymentmethod, grandAmount , couponCode} = req.body;
        console.log("order value" ,userId, shipping , items , totalAmount);
        const order = new Order({
            userId,
            shipping,
            items,
            totalAmount: parseInt(totalAmount),
            grandAmount,
            couponCode,
            paymentmethod,
            paymentStatus : paymentmethod === 'cod' ? 'completed' : 'pending'
        });
        if(paymentmethod === 'rozarpay'){
            const options = {
                amount:grandAmount*100,
                currency:"INR",
                receipt:`order_${Date.now()}`
            }
            const razorpayOrder = await razorpay.orders.create(options);
            order.razorpayOrderId = razorpayOrder.id;
            await order.save();
            const cart = await Cart.findOne({userId});
            if(!cart){
                return res.status(400).json({msg:'cart not found'});
            }
            cart.items = [];
            await cart.save();
            return res.status(200).json({order:razorpayOrder, dbOrderId:order._id});
        }
        await order.save();
         res.status(201).json(order);
        const cart = await Cart.findOne({userId});
        if(!cart){
            return res.status(400).json({msg:'cart not found'});
        }
        cart.items = [];
        await cart.save();
        console.log("after",order);
    } catch (error) {
        res.status(500).json({error:'order creation failled'});
    }
} );

router.post('/verify-payment', async (req , res) =>{
    const { orderId , paymentId , signature} = req.body;

    const order = await Order.findOne({razorpayOrderId : orderId});
    if(!order) return res.status(404).json({msg:'order not found'});

    const generatedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(orderId + "|" + paymentId).digest("hex");

    if(generatedSignature !== signature){
        return res.status(500).json({msg:"invalid payment"});
    }
    order.paymentStatus = "completed";
    order.razorpayPaymentId = paymentId;
    order.razorpaySignature = signature;

    await order.save();

    res.json({success: true});
});

router.get('/getorders',verfiryToken , async (req,res) =>{
    const userId = req.userId;
    try {
        const orders = await Order.find({userId:userId}).sort({createdAt:-1}).limit(10).populate('items.productId');
        res.json(orders);
    } catch (error) {
        res.json({msg:"order fetching failled"});
    }
});

router.get('/getorderDetails/:id', verfiryToken ,async (req,res) =>{
    try {
        console.log("hello");
        const userId = req.userId;
        const orderId = req.params.id;
        console.log("orderid ",orderId);
        const orders = await Order.findOne({userId:userId,_id:orderId}).populate("items.productId");
        res.json(orders );
        console.log("vvv");
    } catch (error) {
        
    }
});

router.get('/adminorders', async (req, res) =>{
    try {
        const order = await Order.find({orderStatus:{$ne : "Delivered"}}).populate("items.productId","_id tittle images price");
        res.json(order);
    } catch (error) {
        res.json({msg:"fetching failed"});
    }
});

router.put('/updateAdminOrder/:id' , async (req,res) =>{
    try {
        
        const status  = req.body.status;
        console.log("orderupda",status);
        const order = await Order.findById(req.params.id).populate("items.productId","tittle images price");

        
        order.orderStatus = status;
        order.timestamps[status] = new Date();
        await order.save();
        res.json(order);
        console.log("update",order);
    } catch (error) {
        res.json({msg:"fetching failed"});
    }
})





module.exports = router;