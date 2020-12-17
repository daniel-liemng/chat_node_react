import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "react-bootstrap";

import "./App.css";
import Register from "./pages/Register";

const App = () => {
  return (
    <Container className='pt-5'>
      <Register />
    </Container>
  );
};

export default App;
