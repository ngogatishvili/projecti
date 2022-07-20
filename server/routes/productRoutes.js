const express=require('express');
const {StatusCodes}=require('http-status-codes')

const productRouter=express.Router();

const ProductModel=require("../models/ProductModel")
const expressAsyncHandler=require('express-async-handler')

productRouter.get("/",async(req,res)=>{
    const products=await ProductModel.find({});
    res.send(products);
})

productRouter.get("/categories",expressAsyncHandler(async(req,res)=>{
        const categories=await ProductModel.find({}).distinct("category");
        res.send(categories);
}))

const PAGE_SIZE=3;

productRouter.get("/search",expressAsyncHandler(async(req,res)=>{
    const {query}=req;
    const pageSize=query.pageSize||PAGE_SIZE;
    const page=query.page||1;
    const category=query.category||"";
    const brand=query.brand||"";
    const price=query.price||"";
    const rating=query.rating||"";
    const order=query.order||"";
    const searchQuery=query.query||"";

   const QueryFilter=searchQuery&&searchQuery!=="all"?{
       name:new RegExp(searchQuery,'i')
   }:{}

   const CategoryFilter=searchQuery&&searchQuery!=="all"?{
       category
   }:{}
   const RatingFilter=rating&&rating!=="all"?{
       rating:{
           $gte:Number(rating)
       }
   }:{}
   const PriceFilter=price&&price!=="all"?{
       price:{
           $gte:Number(price.split("-")[0]),
           $lte:Number(price.split("-")[1])
       }
   }:{}
   const sortOrder=
   order==="lowest"?
   {price:1}:
   order==="highest"?
   {price:-1}:
   order==="newest"?
   {createdAt:-1}:
   order==="toprated"?
   {rating:-1}:{_id:-1}

   const products=await ProductModel.find({
       ...QueryFilter,...CategoryFilter,...RatingFilter,...PriceFilter
   }).sort(sortOrder).skip(pageSize*(page-1)).limit(pageSize);

   const countProducts=await ProductModel.countDocuments({
       ...QueryFilter,...PriceFilter,...CategoryFilter,...RatingFilter
   })
   res.send({
       products,
       countProducts,
       page,
       pages:Math.ceil(countProducts/pageSize)
   })
}))

productRouter.get("/slug/:id",async(req,res)=>{
    const {id}=req.params;
    const product=await ProductModel.findOne({slug:id});
    if(product) {
        return res.status(StatusCodes.OK).send(product);
    }else{
        return res.status(StatusCodes.NOT_FOUND).send({message:"Product not found"})
    }
})

productRouter.get("/:id",async(req,res)=>{
    const {id}=req.params;
    const product=await ProductModel.findById(id);
    if(product) {
        return res.status(StatusCodes.OK).send(product);
    }else{
        return res.status(StatusCodes.NOT_FOUND).send({message:"Product not found"})
    }
})




module.exports=productRouter;

