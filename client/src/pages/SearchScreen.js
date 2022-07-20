import axios from 'axios';
import React, { useReducer ,useEffect, useState} from 'react'
import {useNavigate,useLocation,Link} from "react-router-dom"
import { toast } from 'react-toastify';
import getError from '../utils';
import {Helmet} from "react-helmet-async"
import { Col,Row,Button } from 'react-bootstrap';
import { Rating } from '../components/Rating';
import { Loading } from '../components/Loading';
import { Message } from '../components/Message';
import { Product } from '../components/Product';
import { LinkContainer } from 'react-router-bootstrap';


const prices=[
    {
        name:"$1 to $50",
        value:"1-50"
    },
    {
        name:"$51 to $200",
        value:"51-200",
    },
    {
        name:"$201 to $1000",
        value:"201-1000"
    }
]

export const ratings =[
   {
       name:"4stars & up",
       rating:4
   },
   {
       name:"3 stars & up",
       rating:3
   },
   {
       name:"2 stars & up",
       rating:2
   },
   {
       name:"1 stars & up",
       rating:1
   }
]

const reducer=(state,action)=>{
    switch(action.type) {
        case "FETCH_REQUEST":
            return {...state,loading:true};
        case "FETCH_SUCCESS":
            return {...state,loading:false,
                products:action.payload.products,
                page:action.payload.page,
                pages:action.payload.pages,
                countProducts:action.payload.countProducts
            }
        case "FETCH_FAIL":
            return {
                ...state,loading:false,error:action.payload
            }
            default:return state;
    }
}


const SearchScreen = () => {
    const [categories,setCategories]=useState([])
    const navigate=useNavigate();
    const {search}=useLocation();
    const sp=new URLSearchParams(search);
    const category=sp.get("category")||"all";
    const query=sp.get("query")||"all";
    const price=sp.get("price")||"all";
    const rating=sp.get("rating")||"all";
    const order=sp.get("order")||"newest";
    const page=sp.get("page")||1;

    const [{loading,error,products,countProducts,pages},dispatch]=useReducer(reducer,{
        loading:true,
        error:""
    })

    useEffect(()=>{
        const fetchData=async()=>{
            try {
                const {data}=await axios.get(`http://localhost:4000/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`);
                dispatch({type:"FETCH_SUCCESS",payload:data})
            }catch(err) {
                dispatch({type:"FETCH_FAIL",payload:getError(err)})
            }
        }
        fetchData();
    },[category,query,price,rating,order,page])

    

    useEffect(()=>{
        const fetchCategories=async()=>{
            try {
                const {data}=await axios.get("http://localhost:4000/products/categories");
                setCategories(data)
            }catch(err) {
                toast.error(getError(err))
            }
        }
        fetchCategories();
       
    },[])

    const getFilterUrl=(filter)=>{
        const filterPage=filter.page||page;
        const filterCategory=filter.category||category;
        const filterQuery=filter.query||query;
        const filterRating=filter.rating|rating;
        const filterPrice=filter.price||price;
        const sortOrder=filter.order||order;
        return `/search?page=${filterPage}&query=${filterQuery}&category=${filterCategory}&rating=${filterRating}&price=${filterPrice}&order=${sortOrder}`
    }

    
   

  return (
    <div>
        <Helmet>
            <title>Search Products</title>
        </Helmet>
        <Row>
            <Col md={3}>
                <div>
                <h3>Departments</h3>
                    <ul>
                        <li>
                            <Link to={getFilterUrl({category:"all"})} className={category==="all"?"text-bold":""}>
                                Any
                            </Link>
                        </li>
                        {categories.map(c=>(
                            <li key={category}>
                                <Link to={getFilterUrl({category:c})} className={category===c?"text-bold":""}>
                                    {c}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3>Price</h3>
                    <ul>
                        <li>
                            <Link className={price==="all"?"text-bold":""} to={getFilterUrl({price:"all"})}>
                                    Any
                            </Link>
                        </li>
                        {
                            prices.map(p=>(
                                <li key={p.name}>
                                    <Link to={getFilterUrl({price:p.value})} className={price===p.value?"text-bold":""}>{p.name}</Link>
                                </li>
                            ))
                        }

                    </ul>
                    
                </div>
                <div>
                    <h3>Avg. Customer Review</h3>
                    <ul>
                    {ratings.map(r=>(
                        <li key={r.name}>
                            <Link className={rating===r.rating?"text-bold":""} to={getFilterUrl({rating:r.rating})}>
                                <Rating caption={" & up"} rating={r.rating}/>
                            </Link>
                        </li>
                    ))}
                    <li>
                        <Link to={getFilterUrl({rating:"all"})} className={rating==="all"?"text-bold":""}>
                        <Rating capture={" & up"} rating={0}/>
                        </Link>
                    </li>
                    </ul>
                </div>
            </Col>
            <Col md={9}>
                {loading? <Loading/>:
                error? <Message variant="danger">{error}</Message>:
                    (
                        <>
                        <Row className="justify-content-between mb-3">
                            <Col md={6}>
                            {countProducts===0?"No":countProducts} Result
                            {query!=="all"&& ":"+query}
                            {category!=="all" && ":"+category}
                            {price!=="all" && ":Price "+price}
                            {rating!=="all" && ":Rating "+rating+"& up"}
                            {query!=="all"||price!=="all"||category!=="all"||rating!=="all"?
                            <Button variant="light" onClick={()=>navigate("/search")}>
                                <i className="fas fa-times-circle"></i>
                            </Button>:null
                            }

                            </Col>
                            <Col className="text-end">
                                Sort By {' '}
                                <select value={order} onChange={e=>navigate(getFilterUrl({order:e.target.value}))}>
                                    <option value="newest">Newest arrivals</option>
                                    <option value="lowest">Price low to high</option>
                                    <option value="highest">Price high to low</option>
                                    <option value="toprated">Avg. Customer Reviews</option>
                                </select>
                            </Col>
                        </Row>
                        {products.length===0 && (
                            <Message>No Products found</Message>
                        )}

                        <Row>
                            {products.map(product=>(
                                <Col sm={6} lg={4} className="mb-3" key={product._id}>
                                    <Product product={product}/>
                                </Col>
                            ))}
                        </Row>

                        <div>
                            {[...Array(pages).keys()].map((x)=>(
                                <LinkContainer key={x+1} className="mx-1" to={getFilterUrl({page:x+1})}
                                >
                                    <Button className={Number(page)===x+1?"text-bold":""} variant="light">{x+1}</Button>
                                </LinkContainer>
                            ))}

                        </div>

                        </>
                    )
                }
            </Col>
        </Row>
    </div>
  )
}

export default SearchScreen
