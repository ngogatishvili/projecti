import React from 'react';
import {Row,Col} from "react-bootstrap"

export const CheckoutSteps = (props) => {
  return (
    <Row className="checkout-steps">
        <Col className={props.step1?"active":""}>Sign in</Col>
        <Col className={props.step2?"active":""}>Shipping</Col>
        <Col className={props.step3?"active":""}>Payment</Col>
        <Col className={props.step4?"active":""}>Place order</Col>
    </Row>
  )
}
