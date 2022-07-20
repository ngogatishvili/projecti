import React,{useContext, useEffect, useReducer} from 'react'
import {Loading} from "../components/Loading";
import {Message} from "../components/Message";
import {useNavigate,useParams,Link} from 'react-router-dom'
import {Store} from "../Store";
import axios from "axios"
import getError from '../utils';
import {Helmet} from "react-helmet-async";
import {Row,Col, Card,ListGroup, ListGroupItem} from "react-bootstrap";
import {usePayPalScriptReducer,PayPalButtons} from "@paypal/react-paypal-js"
import { toast } from 'react-toastify';



const reducer=(state,action)=>{
     switch(action.type) {
         case "FETCH_REQUEST":
             return {...state,loading:true,error:""};
         case "FETCH_SUCCESS":
             return {...state,loading:false,order:action.payload,error:""}
         case "FETCH_FAIL":
             return {...state,loading:false,error:action.payload}
        case "PAY_REQUEST":
            return {...state,loadingPay:true}
        case "PAY_SUCCESS":
            return {...state,loadingPay:false,successPay:true}
        case "PAY_FAIL":
            return {...state,loadingPay:false}
        case "PAY_RESET":
            return {...state,loadingPay:false,successPay:false}
        default:return state;
     }
}



const OrderScreen = () => {

    const {state}=useContext(Store)
    const {userInfo}=state;
    const params=useParams();
    const {id:orderId}=params;
    const navigate=useNavigate();
    const [{loading,error,order,loadingPay,successPay},dispatch]=useReducer(reducer,{
        loading:true,
        error:"",
        order:{},
        loadingPay:false,
        successPay:false

    })
    const [{isPending},paypalDispatch]=usePayPalScriptReducer()

   const createOrder=(data,actions)=>{
        return actions.order
        .create({
            purchase_units:[
                {
                    amount:{value:order.totalPrice}
                }
            ]
        })
        .then(orderID=>{
            return orderID;
        })
   }

   const onApprove=(data,actions)=>{
        return actions.order.capture().then(async function(details) {
                try {
                    const {data}=await axios.put(`http://localhost:4000/orders/${order._id}/pay`,details,{
                        headers:{
                            authorization:`Bearer ${userInfo.token}`
                        }
                    })
                dispatch({type:"PAY_REQUEST"});
                dispatch({type:"PAY_SUCCESS",payload:data});
                toast.success("Order is paid")
                }catch(err) {
                    dispatch({type:"PAY_FAIL",payload:getError(err)})
                    toast.error(getError(err))
                }
        })
   }

   const onError=(err)=>{
    toast.error(getError(err))
   }

   
    useEffect(()=>{
        const fetchOrder=async()=>{
            try {
                dispatch({type:"FETCH_REQUEST"});
                const {data}=await axios.get(`http://localhost:4000/orders/${orderId}`,{
                    headers:{
                        authorization:`Bearer ${userInfo.token}`
                    }
                });
                console.log(data);
                dispatch({type:"FETCH_SUCCESS",payload:data});
            }catch(err) {
                dispatch({type:"FETCH_FAIL",payload:getError(err)})
            }
        }
        if(!userInfo) {
        navigate('/signin')
        }
        if(!order._id || successPay|| (order._id&&orderId!==order._id)) {
                fetchOrder(); 
                if(successPay) {
                    dispatch({type:"PAY_RESET"})
                }
        }else{
            const loadingPaypalScript=async()=>{
                const {data:clientId}=await axios.get(`http://localhost:4000/keys/paypal`);
                paypalDispatch({
                    type:"resetOptions",
                    value:{
                        "client-id":clientId,
                        currency:"USD"
                    }
                })
                paypalDispatch({type:"setLoadingStatus",value:"pending"})
            }
            loadingPaypalScript();
        }

    },[navigate,userInfo,orderId,order._id,paypalDispatch,successPay])
    
  return loading? <Loading/>: error ? <Message>{error}</Message>:(
      <div>
        <Helmet>
            <title> Order {orderId}</title>
        </Helmet>
            <h1 className="my-3">Order {orderId}</h1>
            <Row>
            <Col md={8}>
                <Card className="mb-3">
                    <Card.Body>
                        <Card.Title>Shipping</Card.Title>
                        <Card.Text>
                            <strong>Name:</strong> {order.shippingAddress.fullName} <br/>
                            <strong>Address:</strong>{order.shippingAddress.address},{order.shippingAddress.city},{order.shippingAddress.postalCode},{order.shippingAddress.country}
                        </Card.Text>
                        {order.isDelivered? (
                            <Message variant="success">Delivered at {order.deliveredAt}</Message>
                        ):
                        (
                            <Message variant="danger">Not delivered</Message>
                        )
                        }
                    </Card.Body>
                </Card>
                <Card className="mb-3">
                    <Card.Body>
                        <Card.Title>Payment</Card.Title>
                        <Card.Text>
                            <strong>Method:</strong> {order.paymentMethod}
                        </Card.Text>
                        {order.isPaid? (
                            <Message variant="success">Paid at {order.paidAt}</Message>
                        ):
                            (
                            <Message variant="danger">Not Paid</Message>
                            )
                        }
                    </Card.Body>
                </Card>
                <Card className="mb-3">
                    <Card.Body>
                        <Card.Title>Items</Card.Title>
                        <ListGroup variant="flush">
                            {order.orderItems.map(item=>(
                                <ListGroupItem key={item._id}>
                                    <Row className="align-items-center">
                                        <Col md={6}>
                                            <img src={item.image} alt={item.name} className="img-fluid rounded img-thumbnail"/>
                                            <Link to={`/products/${item.slug}`}>{item.name}</Link>
                                        </Col>
                                        <Col md={3}>{item.quantity}</Col>
                                        <Col md={3}>${item.price}</Col>
                                    </Row>
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={4}>
                <Card className="mb-4">
                    <Card.Body>
                    <Card.Title>Order Summary</Card.Title>
                    <ListGroup variant="flush">
                        <ListGroupItem>
                            <Row>
                                <Col>Items</Col>
                                <Col>$ {order.itemsPrice.toFixed(2)}</Col>
                            </Row>
                        </ListGroupItem>
                        <ListGroupItem>
                            <Row>
                                <Col>Shipping</Col>
                                <Col>$ {order.shippingPrice.toFixed(2)}</Col>
                            </Row>
                        </ListGroupItem>
                        <ListGroupItem>
                            <Row>
                                <Col>Tax</Col>
                                <Col>$ {order.taxPrice.toFixed(2)}</Col>
                            </Row>
                        </ListGroupItem>
                        <ListGroupItem>
                            <Row>
                                <Col>Order Total</Col>
                                <Col>$ {order.totalPrice.toFixed(2)}</Col>
                            </Row>
                        </ListGroupItem>
                        {!order.isPaid && (
                            <ListGroupItem>
                                {isPending? (
                                    <Loading/>):(
                                        <div>
                                        <PayPalButtons
                                createOrder={createOrder}
                                onApprove={onApprove}
                                onError={onError}
                                >
                                </PayPalButtons>
                                </div>
                                    )
                                }

                                {loadingPay && <Loading/>}
                                
                            </ListGroupItem>
                        )}
                    </ListGroup>
                    </Card.Body>
                </Card>
            </Col>
            </Row>
      </div>
  )
}

export default OrderScreen;
