const mongoose = require('mongoose');
const product = require('./product');

const wishlistSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    productId:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    }]
});

module.exports = mongoose.model("Wishlist",wishlistSchema);