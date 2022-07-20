import React, { useContext, useState, useEffect } from "react";
import { Button, Form, FormCheck } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CheckoutSteps } from "../components/CheckoutSteps";
import { Store } from "../Store";

export const PaymentMethodScreen = () => {
  const navigate = useNavigate();
  const { state, dispatch: cxtDispatch } = useContext(Store);
  const { shippingAddress, paymentMethod } = state.cart;
  const [paymentMethodName, setPaymentMethodName] = useState(
    paymentMethod || "PayPal"
  );
  const submitHandler = (e) => {
    e.preventDefault();
    cxtDispatch({type:"SAVE_PAYMENT_METHOD",payload:paymentMethodName});
    localStorage.setItem("paymentMethod",JSON.stringify(paymentMethodName));
    navigate("/placeorder");
  };

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);
  return (
    <div>
      <CheckoutSteps step1 step2 step3 />
      <div className='container small-container'>
        <h1 className='my-3'>Payment Method</h1>
        <Form onSubmit={submitHandler}>
          <div className='mb-3'>
            <FormCheck
              type='radio'
              id='PayPal'
              label='PayPal'
              value='PayPal'
              checked={paymentMethodName === "PayPal"}
              onChange={(e) => setPaymentMethodName(e.target.value)}
            />
          </div>
          <div className='mb-3'>
            <FormCheck
              type='radio'
              id='Stripe'
              label='Stripe'
              value='Stripe'
              checked={paymentMethodName === "Stripe"}
              onChange={(e) => setPaymentMethodName(e.target.value)}
            />
          </div>
          <div className='mb-3'>
            <Button type='submit'>Continue</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};
