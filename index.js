const express = require('express');
const cors = require("cors");
const  mongoose = require("mongoose");
const path = require("path");
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv').config();
const crypto = require('crypto');



var app = express();

app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}));
app.use(express.urlencoded({limit:'50mb',extended:true}));
app.use(express.json());



app.use('/images', express.static(__dirname + '/public/images'));



  
const UserData = require("./routes/User");
const Product = require("./routes/product");
const Category = require('./routes/category');
const Subcategory = require('./routes/subcategory');
const Authroutes = require('./routes/authRoutes');
const Cart = require('./routes/cart');
const Order = require('./routes/order');
const Wishlist = require('./routes/wishlist');
const Coupon = require('./routes/coupon');

app.use("/api",UserData);
app.use("/api",Product);
app.use('/api',Category);
app.use('/api',Subcategory);
app.use('/api',Authroutes);
app.use('/cart',Cart);
app.use('/api', Order); 
app.use('/api',Wishlist); 
app.use('/api',Coupon);
    

const connecTodb = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('success');
    }
    catch(error){
        console.log(error);
        process.exit(1);
    }
    
}

connecTodb();
  
     
     
const port=process.env.PORT;   

app.listen(port, () =>{
    console.log(`server started at:${port}`);
});