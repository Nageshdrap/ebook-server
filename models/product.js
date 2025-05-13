const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
        tittle:{
            type:String,
            required:true
        },
        keywords:{
            type:[String],
            required:true
        },
        images:{
            type:Array,
            
        },
        author:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        mrp:{
            type:Number,
            required:true
        },
        discount:{
            type:Number,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        category:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"category",
            required:true
        },
        subcategory:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"subcategory",
            required:true
        },
        random:{
            type:Number,
            default: ()=>Math.random(),
            index:true
        }
        // stock:{
        //     type:String,
        //     enum:['Avaliable','Not avaliable'],
        //     default:'Not avaliable',
        //     reuired:true
        // }

        
});


module.exports = mongoose.model("Product",productSchema);