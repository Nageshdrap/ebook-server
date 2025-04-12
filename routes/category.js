

const express = require('express');
const Category = require('../models/category');
const router = express.Router();


// Add category

router.post('/category', async (req,res)=>{
    try{
        const {name} = req.body;

        const existingCategory = await Category.findOne({name});
        if(existingCategory){
            return res.status(400).json({message:'category already exists'})
        }
        const category = new Category({name});
        await category.save();
        res.status(201).json({message:'category add successfully'});


    }catch(error){
        res.status(500).json({message:'server error', error});
    }
})

// Get all category

router.get('/category', async (req,res) =>{
    try{

        const category = await Category.find();
        res.send(category);

    }catch(error){
        res.status(500).json({message:'category get failed', error});
    }
})

// Update all category

router.patch('/category/:id', async(req,res)=>{
    try{
        const {name} = req.body;
        const category = await Category.findByIdAndUpdate(req.params.id, {name} ,{new:true});

        if(!category){
            return res.status(400).json({message:"catgory is not exists"});
        }
        res.status(201).json({message:'category added successfully'});
    }catch(error){
        res.status(500).json({message:"server error", error});
    }
})

// delete category

router.delete('/category/:id', async (req, res)=>{
        try{
            const category = await Category.findByIdAndDelete(req.params.id);

            if(!category){
                return res.status(400).json({message:'category is not present'});
            }
            res.json({message:"category deleted successfully"});
        }catch(error){
            res.status(500).json({message:'server error',error});
        }
})

module.exports = router;