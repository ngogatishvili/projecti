import axios from 'axios';
import React, { useState,useEffect, useContext } from 'react';
import {Button, Container, Form, FormControl, FormGroup, FormLabel} from "react-bootstrap"
import { useLocation, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import {toast} from "react-toastify"
import getError from '../utils';
import {Link} from "react-router-dom";


export const SignUpScreen = () => {
    const {state,dispatch:cxtDispatch}=useContext(Store);
    const {search}=useLocation();
    const redirectURL=new URLSearchParams(search).get("redirect");
    const redirect=redirectURL || "/";
    const navigate=useNavigate();
    const {state:{userInfo}}=useContext(Store);
    const [name,setName]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [confirmPassword,setConfirmPassword]=useState("")
    const submitHandler=async(e)=>{
        e.preventDefault();
        if(password!==confirmPassword) {
            toast.error("Passwords do not match")
            return;
        }
        try {
            const {data}=await axios.post('http://localhost:4000/users/signup',{name,email,password,confirmPassword})
            cxtDispatch({type:"SIGN_USER",payload:data})
        }catch(err) {
            toast.error(getError(err))
        }
        
    
    }
    useEffect(()=>{
        if(userInfo) {
            navigate(redirect)
        }
    },[userInfo,redirect,navigate])

  return (
    <Container className="container small-container">
        <h1 className="my-3">Sign Up</h1>
        <Form onSubmit={submitHandler}>
            <FormGroup controlId="name">
                <FormLabel>Name</FormLabel>
                <FormControl onChange={e=>setName(e.target.value)}/>
            </FormGroup>
            <FormGroup controlId="E-mail">
                <FormLabel>E-mail</FormLabel>
                <FormControl type="email" onChange={e=>setEmail(e.target.value)}/>
            </FormGroup>
            <FormGroup controlId="password">
                <FormLabel>Password</FormLabel>
                <FormControl type="password" onChange={e=>setPassword(e.target.value)}/>
            </FormGroup>
            <FormGroup controlId="confirmPassword">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl type="password" onChange={e=>setConfirmPassword(e.target.value)}/>
            </FormGroup>
            <div className="mb-3">
                <Button type="submit">Sign up</Button>
            </div>
            <div className="mb-3">
                Already a member?
                <Link to={`signin?redirect=${redirect}`}>Sign In</Link>
            </div>
        </Form>
    </Container>
  )
}

