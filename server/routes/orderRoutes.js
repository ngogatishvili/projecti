const express=require('express');
const expressAsyncHandler=require('express-async-handler');
const OrderModel=require('../models/OrderModel');
const orderRouter=express.Router();

const {isAuth}=require("../utils")


orderRouter.post('/',isAuth,expressAsyncHandler(async(req,res)=>{
    const newOrder=new OrderModel({
        orderItems:req.body.orderItems.map(x=>({...x,product:x._id})),
        shippingAddress:req.body.shippingAddress,
        paymentMethod:req.body.paymentMethod,
        itemsPrice:req.body.itemsPrice,
        shippingPrice:req.body.shippingPrice,
        taxPrice:req.body.taxPrice,
        totalPrice:req.body.totalPrice,
        user:req.user._id,
    })
    const order=await newOrder.save();
    console.log(order);
    return res.status(201).json({message:"New order created",order})

}))

orderRouter.get("/mine",isAuth,expressAsyncHandler(async(req,res)=>{
    const orders=await OrderModel.find({user:req.user._id});
    res.send(orders);
}))


orderRouter.get("/:id",isAuth,expressAsyncHandler(async(req,res)=>{
    const {id:orderId}=req.params;
    const order=await OrderModel.findById(orderId);
    if(order) {
        console.log("warmat")
        res.send(order);
    }else{
        res.status(404).send({message:"Order not found"})
    }
}))

orderRouter.put("/:id/pay",isAuth,expressAsyncHandler(async(req,res)=>{
        const {id}=req.params;
        const order=await OrderModel.findById(id);
        if(order) {
            order.isPaid=true;
            order.paidAt=Date.now();
            order.paymentStatus={
                id:req.body.id,
                status:req.body.status,
                update_time:req.body.update_time,
                email_address:req.body.email_address
            }
            const updateorder=await order.save();
            res.send({message:"Order paid",order:updateorder})
        }else{
            res.status(404).send({message:"order not found"})
        }
       
}))



module.exports=orderRouter;




