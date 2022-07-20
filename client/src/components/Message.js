import React from 'react';
import {Alert} from "react-bootstrap";

export const Message = ({variant,children}) => {
  return (
    <Alert variant={variant || "info"}>{children}</Alert>
  )
}
