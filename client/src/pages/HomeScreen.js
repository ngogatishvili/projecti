import React, { useContext, useEffect, useReducer } from "react";
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import { Product } from "../components/Product";
import { Loading } from "../components/Loading";
import { Message } from "../components/Message";
import { Store } from "../Store";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, products: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const HomeScreen = () => {
  const [{ loading, products, error }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
    products: [],
  });
  useEffect(() => {
    dispatch({ type: "FETCH_REQUEST" });
    const fetchData = async () => {
      try {
        const result = await axios.get(`http://localhost:4000/products`);
        console.log(result.data);
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
    };
    fetchData();  
  }, []);
  
  return (
    <div>
      <h1>Featured Products</h1>

      <div>
        {loading ? (
          <Loading/>
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <div className='products'>
            <Row>
              {products?.map((product) => (
                <Col key={product.slug} sm={6} md={4} lg={3}>
                  <Product product={product} />{" "}
                </Col>
              ))}
            </Row>
          </div>
        )}
      </div>
    </div>
  );
};
