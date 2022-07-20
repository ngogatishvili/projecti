import React,{useContext,useReducer,useState} from 'react';
import {Store} from "../Store";
import {Helmet} from "react-helmet-async";
import {Form,FormLabel,FormControl, FormGroup,Button} from "react-bootstrap";
import getError from '../utils';
import {toast} from "react-toastify"
import axios from 'axios';

const reducer=(state,action)=>{
    switch(action.type) {
        case "UPDATE_REQUEST":
            return {...state,loadingUpdate:true}
        case "UPDATE_SUCCESS":
            return {...state,loadingUpdate:false}
        case "UPDATE_FAIL":
            return {...state,loadingUpdate:false}
        default:return state
    }
}
export const ProfileScreen = () => {
    const [{loadingUpdate},dispatch]=useReducer(reducer,{
        loadingUpdate:false
    })
    const {state,dispatch:cxtDispatch}=useContext(Store);
    const {userInfo}=state;

    const [name,setName]=useState(userInfo.name);
    const [email,setEmail]=useState(userInfo.email)
    const [password,setPassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");
    const submitHandler=async(e)=>{
        e.preventDefault();
        dispatch({type:"UPDATE_REQUEST"});
        try {
            const {data}=await axios.put(`http://localhost:4000/users/profile`,{
                name,email,password
            },
            {
                headers:{
                    authorization:`Bearer ${userInfo.token}`
                }
            })
            dispatch({type:"UPDATE_SUCCESS"});
            cxtDispatch({type:"SIGN_USER",payload:data})
            localStorage.setItem("user",JSON.stringify(data));
            toast.success("User updated succesfully")
        }catch(err) {
            dispatch({type:"UPDATE_FAIL"});
            toast.error(getError(err))
        }
    }
  return (
    <div className="container small-container">
        <Helmet>
           <title>User Profile</title> 
        </Helmet>
        <h1 className="my-3">User Profile</h1>
            <Form onSubmit={submitHandler}>
            <FormGroup className="mb-3" controlId="name">
                <FormLabel>Name</FormLabel>
                <FormControl value={name} onChange={(e)=>setName(e.target.value)} required/>
            </FormGroup>
            <FormGroup className="mb-3" controlId="email">
                <FormLabel>E-mail</FormLabel>
                <FormControl type="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            </FormGroup>
            <FormGroup className="mb-3" controlId="password">
                <FormLabel>Password</FormLabel>
                <FormControl type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            </FormGroup>
            <FormGroup className="mb-3" controlId="confirmPassword">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
            </FormGroup>
            <div className="mb-3">
                <Button type="submit">Update</Button>
            </div>
            </Form>
    </div>
  )
}
