

const express = require('express');
const router = express.Router();
const SubCategory = require('../models/subcategory');
const Category = require('../models/category');




router.post('/subcategory', async (req,res)=>{
    try{
        console.log(req.body);
        const {name , category} = req.body;

        const Categoryexists = await Category.findById(category);
        if(!Categoryexists){
            return res.status(400).json({message:'category already exists'});
        }
        const subcategory = new SubCategory({name , category});
        subcategory.save();
        res.status(201).json({message:'subcategory added successfully'});
    }catch(error){
        res.status(500).json({message:'subcategory added failed'});
    }
}) 

router.get('/subcategory',async (req,res) =>{
    try{
       const Subcategory = await SubCategory.find();
       res.send(Subcategory);
    }catch(error){
        res.status(500).json({message:'server error', error})
    }
})

router.get('/by-category/:id', async (req,res)=>{
    try{
        const subcategory =await SubCategory.find({category:req.params.id});
        res.json(subcategory);
    }catch(error){
        res.status(500).json({message:'server error', error})
    }
})

router.delete('/subcategory/:id', async (req,res)=>{
    try{
        const subcategory = await SubCategory.findByIdAndDelete(req.params.id);
        if(!subcategory){
            return res.status(400).json({message:'subcategory not exists'});
        }
        res.status(201).json({message:'subcategory deleted successfully'});
    }catch(error){
        res.status(500).json({message:'server error', error})
    }
})


module.exports= router;