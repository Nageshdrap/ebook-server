const express = require('express');
const Coupon = require('../models/coupon');

const router = express.Router();



router.post('/coupon', async (req,res) =>{
    try {
        const {couponCode ,totalCost} = req.body;
        const coupon = await Coupon.findOne({code:couponCode.toUpperCase()});

        if(!coupon) return res.json({msg:'Invalid coupon '});
        if(coupon.expiresAt < new Date()) return res.json({msg:'coupon expired'});

        const discountAmount =Math.round((coupon.discount/100)*totalCost) ;
        const discountedTotal = totalCost - discountAmount;
        res.json({success:true,msg:'coupon applied',
            discountAmount,discountedTotal
        });
    } catch (error) {
        res.json({msg:'server error'});
    }
});

module.exports = router;


