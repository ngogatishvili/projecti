import React,{useContext} from 'react'
import {Button, Card} from "react-bootstrap"
import {Link} from "react-router-dom"
import { Rating } from './Rating'
import { Store } from '../Store'
import axios from 'axios'

export const Product = ({product}) => {
  const {state:{cart},dispatch:cxtDispatch}=useContext(Store);
  const {cartItems}=cart;
  const addToCartHandler=async(item)=>{
    const existItem=cartItems.find(product=>product._id===item._id);
    const quantity=existItem? existItem.quantity+1:1;
    const {data}=await axios.get(`http://localhost:4000/products/${item._id}`);
    if(data.countInStock<quantity) {
      window.alert("Sorry, product is out of stock");
      return;
    }
    cxtDispatch({type:"ADD_CART_ITEM",payload:{...item,quantity}})

  }
  return (
    <div className="product mb-3">
        <Card>
        <Link to={`/products/${product.slug}`}>
        <img src={product.image} alt={product.name} className="card-img-top"/>
        </Link>
        <Link to={`/products/${product.slug}`}>
        <Card.Title>{product.name}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews}/>
        <Card.Text>$ {product.price}</Card.Text>
        {product.countInStock===0 ? <Button disabled variant="primary">Out of stock</Button>: <Button onClick={()=>addToCartHandler(product)}>Add to Cart</Button>}
       
        
        
    </Card>
    </div>
    
  )
}
