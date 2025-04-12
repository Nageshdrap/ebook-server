const mongoose = require('mongoose');
const order = require('./order');


const paymentSchema = new mongoose.Schema({
    order:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'order'
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Userinfo',
        required:true
    },
    paymentMethod:{
        type:String,
        enum:["credit card","Debit card","Paypal","Cash on delivery"],
        required:true
    },
    transactionId:{
        type:String
    },
    status:{
        type:String,
        enum:["success","failed","pending"],
        default:'pending'
    },
    createdAT:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('payment', paymentSchema);