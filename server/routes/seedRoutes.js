const express=require('express');

const seedRouter=express.Router();
const ProductModel=require("../models/ProductModel");
const UserModel=require("../models/UserModel")
const data=require("../data")

seedRouter.get("/",async(req,res)=>{
        await ProductModel.remove({})
        const createdProducts=await ProductModel.insertMany(data.products);
        await UserModel.remove({})
        const createdUsers=await UserModel.insertMany(data.users);
        res.send({createdUsers,createdProducts})

})

module.exports=seedRouter;