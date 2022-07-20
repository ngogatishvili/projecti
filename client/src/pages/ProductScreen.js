import React,{useEffect, useReducer,useContext} from 'react'
import {useNavigate, useParams} from "react-router-dom";
import {Row,Col, ListGroup, ListGroupItem,Card,Badge, Button} from "react-bootstrap"
import axios from 'axios';
import { Rating } from '../components/Rating';
import { Loading } from '../components/Loading';
import { Message } from '../components/Message';
import getError from '../utils';
import { Store } from '../Store';


const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, product: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const ProductScreen = () => {
  const navigate=useNavigate()
  const [{loading,product,error},dispatch]=useReducer(reducer,{
    loading:true,
    product:{},
    error:""
  })
  const param=useParams();
  const {id}=param;
  useEffect(()=>{
    const fetchData=async()=>{
      dispatch({type:"FETCH_REQUEST"})
      try {
        const result=await axios.get(`http://localhost:4000/products/slug/${id}`)
        dispatch({type:"FETCH_SUCCESS",payload:result.data})
      }catch(err) {
          dispatch({type:"FETCH_FAIL",payload:getError(err)})
      }
      
    }
    fetchData();
  },[id])

  const {state,dispatch:ctDispatch}=useContext(Store);
  const {cart}=state;


  const addToCartHandler=async()=>{
    const existItem=cart.cartItems.find(item=>item._id===product._id);
    console.log(existItem);
    const quantity=existItem? existItem.quantity+1:1;
    const {data}=await axios.get(`http://localhost:4000/products/${product._id}`);
    if(data.countInStock<quantity) {
      window.alert("sorry, product is out of stock")
    }
    const newItem={...product,quantity};
    console.log(newItem);
    const newItem1={...product,quantity};
    console.log(newItem1)
   
    
    if(data.countInStock<quantity) {
      window.alert("unfortunately, product is out of stock")
      return;
    }
    ctDispatch({type:"ADD_CART_ITEM",payload:newItem});
    navigate("/cart")
   
  
  }
  return (
    <div>
     {loading? <Loading/>: error? <Message variant="danger">{error}</Message>:

        <Row>
          <Col md={6}>
            <img src={product.image} alt={product.name}/>
          </Col>
          <Col md={3}>
            <ListGroup variant="flush">
                <ListGroupItem>
                  <h1>{product.name}</h1>
                </ListGroupItem>
                <ListGroupItem>
                 $ {product.price}
                </ListGroupItem>
                <ListGroupItem>
                  <Rating rating={product.rating} numReviews={product.numRviews}/>
                </ListGroupItem>
                <ListGroupItem>
                  Description <p>{product.description}</p>
                </ListGroupItem>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <Row>
                <Col>Price</Col>
                <Col>$ {product.price}</Col>
              </Row>
              <Row>
                <Col>status</Col>
                <Col>{product.countInStock>0? <Badge bg="success">In stock</Badge>:<Badge bg="danger">Unavaliable</Badge>}</Col>
              </Row>
            </Card>
            <div className="d-grid">
            {product.countInStock>0 && <Button onClick={addToCartHandler} >Add To Cart</Button>}
            </div>
          </Col>
        </Row>

     }
    </div>
  )
}
