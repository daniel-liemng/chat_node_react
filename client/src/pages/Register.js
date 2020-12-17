import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";

const Register = () => {
  const [userInput, setUserInput] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("register");
  };

  console.log(userInput);

  return (
    <Row className='bg-white py-5 justify-content-center'>
      <Col sm={8} md={6} lg={4}>
        <h1 className='text-center'>Register</h1>
        <Form onSubmit={handleRegister}>
          <Form.Group>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type='email'
              name='email'
              value={userInput.email}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type='text'
              name='username'
              value={userInput.username}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              name='password'
              value={userInput.password}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Confirm password</Form.Label>
            <Form.Control
              type='password'
              name='confirmPassword'
              value={userInput.confirmPassword}
              onChange={handleChange}
            />
          </Form.Group>
          <div className='text-center'>
            <Button variant='success' type='submit'>
              Register
            </Button>
          </div>
        </Form>
      </Col>
    </Row>
  );
};

export default Register;
