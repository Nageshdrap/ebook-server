const express = require('express');
const router = express.Router();
const product = require('../models/product');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { default: mongoose } = require('mongoose');
const { error } = require('console');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv').config();


cloudinary.config({ 
    cloud_name: 'diaf8vavs', 
    api_key: process.env.CLODINARY_API_KEY, 
    api_secret: process.env.CLODINARY_API_SECERT // Click 'View API Keys' above to copy your API secret
});

// const storage = multer.diskStorage({
//     destination: function(req, file , cb){  
//         return cb(null , "./public/images"); 
//     },
//     filename: function(req, file ,cb){
//         return cb(null, `${Date.now() }_${file.originalname}`);
//     }
// });
const storage = multer.memoryStorage();
const upload = multer({storage});

// router.post("/insert-product",upload.array('files'),(req,res)=>{
//     try{
//         const newProduct = new product({
            
//             tittle:req.body.tittle,
//             keywords:JSON.parse(req.body.keyword),
//             images:req.files,
//             author:req.body.author,
//             description:req.body.description,
//             price:req.body.price,
//             category:req.body.category,
//             subcategory:req.body.subcategory
//         });     
//         console.log(req.files);
//             newProduct.save().then(
//             (data)=>{
//                 res.send(data);
//                 console.log(data);  
//                 // res.status(201).json({msg:"data send successfully"});
//             } 
//             )

//     }catch(error){
//         console.log(error);
//         res.status(500).json({msg:"data send failed"});
    
//     }
// })

router.post("/insert-product",upload.array('files'),async (req,res)=>{
    try {
        const files = req.files;
        let imageUrl = [];

        for(const file of files){
            const result = await cloudinary.uploader.upload_stream(
                {
                    resource_type:'image',folder:"ecommerce"
                },
                (error , result) =>{
                    if(error){
                        console.error("cloudinary upload error", error);
                        return res.json({msg:"clodinary upload failled"});
                    }
                    imageUrl.push(result.secure_url);

                    if(imageUrl.length === files.length){
                            const newProduct = new product({
                                        tittle:req.body.tittle,
                                        keywords:JSON.parse(req.body.keyword),
                                        images:imageUrl,
                                        author:req.body.author,
                                        description:req.body.description,
                                        mrp:req.body.mrp,
                                        discount:req.body.discount,
                                        price:req.body.price,
                                        category:req.body.category,
                                        subcategory:req.body.subcategory
                                    }); 
                                    newProduct.save();
                                    res.json({msg:"product added successfully"});
                    }
                }
            ).end(file.buffer);
        }
    } catch (error) {
        
    }
});

router.get('/product', async (req,res)=>{ 
     try{
            product.find().then(  
                (data)=>{
                    res.send(data);
                    // res.status(201).json({msg:"data get successfully"});
                }
            )
           
        }catch(error){
            console.log(error);
            res.status(500).json({msg:"data send failed"});
        }
})

router.get('/productdetails/:id' ,  (req, res) =>{
    try{
         product.findById(req.params.id).then(
            (data)=>{
                res.send(data);
            }
         );
        
        
    }catch(error){
        res.status(500).json({error:'data getting failed'});
    }

})

router.get('/search' , async (req, res) =>{
    try {
        const query = req.query.q;
        console.log("query", query);
        if(!query) return res.status(400).json({msg:'Search query is required'});

        // const products =await product.find({
        //         $or:[
        //             { tittle :{ $regex : query , $options:"i"}},
        //             // {category:{ $regex : query , $options:"i"}},
        //             // {subcategory:{ $regex : query , $options:"i"}},
        //             {keywords : { $regex : query , $options:"i"}}
        //         ],
        // }).populate("category","name").populate("subcategory","name");
        const products = await product.find({}).populate("category","name").populate("subcategory","name");

        const filterProducts = products.filter((items) =>{
            const tittle = items.tittle || "";
            const keywords = items.keywords.join(" ") || "";
            const category = items.category?.name || "";
            const subcategory = items.subcategory?.name || "";

            return(
                tittle.toLowerCase().includes(query.toLowerCase()) || 
                category.toLowerCase().includes(query.toLowerCase()) ||
                subcategory.toLowerCase().includes(query.toLowerCase()) ||
                keywords.toLowerCase().includes(query.toLowerCase())
            );
        })
        console.log("search" , filterProducts);
        res.status(201).json(filterProducts);
    } catch (error) {
        res.status(500).json({ error: " getting search product failled"});
    }
})

module.exports = router;