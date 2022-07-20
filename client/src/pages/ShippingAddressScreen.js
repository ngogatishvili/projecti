import React,{useContext, useEffect, useState} from 'react';
import {Button, Form, FormControl, FormGroup,FormLabel} from "react-bootstrap"
import { useNavigate } from 'react-router-dom';
import { CheckoutSteps } from '../components/CheckoutSteps';
import { Store } from '../Store';

export const ShippingAddressScreen = () => {
    const navigate=useNavigate();
    const {state,dispatch:cxtDispatch}=useContext(Store)
    const {shippingAddress}=state.cart;
    const [fullName,setFullName]=useState(shippingAddress.fullName||"")
    const [address,setAddress]=useState(shippingAddress.address||"")
    const [city,setCity]=useState(shippingAddress.city||"")
    const [postalCode,setPostalCode]=useState(shippingAddress.postalCode||"")
    const [country,setCountry]=useState(shippingAddress.country||"")
    const submitHandler=e=>{
        e.preventDefault();
        cxtDispatch({type:"SAVE_SHIPPING_ADDRESS",payload:{fullName,address,city,postalCode,country}});
        localStorage.setItem("shippingAddress",JSON.stringify({fullName,address,city,postalCode,country}));
        navigate("/payment");
    }
    useEffect(()=>{
        if(!state.userInfo) {
            navigate("/signin?redirect=/shipping")
        }
    },[state.userInfo,navigate])
  return (
    <div>
        <CheckoutSteps step1 step2/>
        <div className="container small-container">
        <h1 className="my-3">Shipping Address</h1>
        <Form onSubmit={submitHandler}>
           <FormGroup className="mb-3" controlId="fullName">
            <FormLabel>Full Name </FormLabel>
            <FormControl value={fullName} onChange={e=>setFullName(e.target.value)} required/>
           </FormGroup>
           <FormGroup className="mb-3" controlId="address">
            <FormLabel>Address </FormLabel>
            <FormControl value={address} onChange={e=>setAddress(e.target.value)} required/>
           </FormGroup>
           <FormGroup className="mb-3" controlId="city">
            <FormLabel>City </FormLabel>
            <FormControl value={city} onChange={e=>setCity(e.target.value)} required/>
           </FormGroup>
           <FormGroup className="mb-3" controlId="postalCode">
            <FormLabel>Postal Code </FormLabel>
            <FormControl value={postalCode} onChange={e=>setPostalCode(e.target.value)} required/>
           </FormGroup>
           <FormGroup className="mb-3" controlId="country">
            <FormLabel>Country </FormLabel>
            <FormControl value={country} onChange={e=>setCountry(e.target.value)} required/>
           </FormGroup>
           <div className="mb-3">
            <Button variant="primary" type="submit">Continue</Button>
           </div>
        </Form>
        </div>
       
    </div>
  )
}
