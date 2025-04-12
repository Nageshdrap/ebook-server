
const mongoose = require('mongoose');
const category = require('./category');


const subcategorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"category",
        required:true
    }
})


module.exports = mongoose.model('subcategory', subcategorySchema);