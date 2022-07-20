import React,{useContext, useState,useEffect} from "react";
import {
  Container,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Button
} from "react-bootstrap";
import { Link,useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {Store} from "../Store";
import {toast} from "react-toastify"
import getError from "../utils";

export const SignInScreen = () => {
  
  const navigate=useNavigate()
  const {state,dispatch:cxtDispatch}=useContext(Store);
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
    const {search}=useLocation();
    const redirectURL=new URLSearchParams(search).get("redirect");
    const redirect=redirectURL? redirectURL:"/"
    const submitHandler=async(e)=>{
      e.preventDefault();
      
        try {
          const {data}=await axios.post(`http://localhost:4000/users/signin`,{email,password})
          cxtDispatch({type:"SIGN_USER",payload:data})
          localStorage.setItem("user",JSON.stringify(data));
          navigate(redirect||"/")
        }catch(err) {
          toast.error(getError(err));
        }

    }
    useEffect(()=>{
      if(state.userInfo) {
        navigate(redirect)
      }
    },[navigate,state.userInfo,redirect])
  return (
    <Container className='small-container'>
      <h1 className='my-3'>Sign In</h1>
      <Form onSubmit={submitHandler}>
        <FormGroup className="mb-3" controlId="email">
          <FormLabel>Email</FormLabel>
          <FormControl type='email' required onChange={(e)=>setEmail(e.target.value)} />
        </FormGroup>
        <FormGroup className="mb-3" controlId="password">
            <FormLabel>Password</FormLabel>
            <FormControl type="password" required onChange={(e)=>setPassword(e.target.value)}/>
        </FormGroup>
        <div className="mb-3">
            <Button type="submit">Sign in</Button>
        </div>
        <div className="mb-3">
            New Customer? <Link to={`/signup?redirect=${redirect}`} >Create your account</Link>
        </div>
      </Form>
    </Container>
  );
};
