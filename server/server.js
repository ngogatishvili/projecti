
const express=require('express');
const app=express();
const seedRouter=require("./routes/seedRoutes");
const productRouter=require("./routes/productRoutes");
const userRouter=require('./routes/userRoutes');
const orderRouter = require('./routes/orderRoutes');
const path=require('path')

const cors=require('cors')
app.use(cors());
const data=require("./data");
const {StatusCodes}=require("http-status-codes")
const dotenv=require('dotenv')
const mongoose=require('mongoose');
dotenv.config();
  

mongoose.connect("mongodb+srv://mern-amazona:niniko1234@cluster0.dnowldg.mongodb.net/mern-amazona-db?retryWrites=true&w=majority").then(()=>{
    console.log('connected to DB')
}).catch(err=>{
        console.log(err.message);
})
   
      
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.get("/keys/paypal",(req,res)=>{
    return res.send("AWZ3JPXo1-gO3dvxcdSaCGZopQmvPKbsglwVVkC11O5B7nw6m-PLRKscL8nBDFhinWFmM8rD4bawGn0A")
})

app.use("/seed",seedRouter)
app.use("/products",productRouter)
app.use('/users',userRouter);
app.use("/orders",orderRouter)


const dirname=path.resolve();

app.use(express.static(path.join(dirname,'/client/build')))

app.get("*",(req,res)=>{
    res.sendFile(path.join(dirname,"/client/build/index.html"))
})

app.use((err,req,res,next)=>{
    res.status(500).send({message:err.message})
})



app.listen(4000,console.log('app running at http://localhost:4000'));

