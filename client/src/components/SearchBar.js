import React,{useState} from 'react'
import { FormControl,Button, Form} from 'react-bootstrap';
import {  useNavigate } from 'react-router-dom';

const SearchBar = () => {
    const navigate=useNavigate();
    const [query,setQuery]=useState("");
    const submitHandler=e=>{
        e.preventDefault();
        navigate(`/search?query=${query}`);

    }
  return (
    <Form onSubmit={submitHandler} className="d-flex">
            <FormControl type="text" id="q" name="q" onChange={(e)=>setQuery(e.target.value)} placeholder="search products..."/>
            <Button type="submit" variant="light">Search</Button>
    
    </Form>
  )
}

export default SearchBar;
