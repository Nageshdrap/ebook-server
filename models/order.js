const mongoose = require("mongoose");
const payment = require("./payment");

const orderSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'UserInfo',
        required:true
    },
    shipping:{
        address:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        dist:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        phone:{
            type:String,
            required:true
        },
        pincode:{
            type:String,
            required:true
        }
    },
    items:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Product'
                
            },
            quantity:{
                type:Number,
                required:true
            },
            price :{
                type: Number,
            },
        }
    ],
    totalAmount:{
        type:Number,
        required:true
    },
    grandAmount:{
        type:Number,
        required:true
    },
    couponCode:{
        type:String
    },
    paymentmethod:{
        type:String,
        enum:['cod' , 'rozarpay']
    },
    razorpayOrderId:{
        type:String
    },
    razorpayPaymentId:{
        type:String
    },
    razorpaySignature:{
        type:String
    },
    paymentStatus:{
        type:String,
        enum:["pending","completed","failed"],
        default:"pending"
    },
    orderStatus:{
        type:String,
        enum:["processing","shipped","Out for Delivery","Delivered","cancelled"],
        default:"processing"
    },
    timestamps:{
        processing:{type:Date , default:Date.now},
        shipped:{type:Date},
        'Out for Delivery':{type:Date},
        Delivered:{type:Date}
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
    
  

})


module.exports = mongoose.model('order', orderSchema);