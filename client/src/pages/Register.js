import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { Row, Col, Form, Button } from "react-bootstrap";
import { gql, useMutation } from "@apollo/client";

// Query
const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      username: $username
      email: $email
      password: $password
      confirmPassword: $confirmPassword
    ) {
      username
      email
      createdAt
    }
  }
`;

const Register = () => {
  const history = useHistory();

  const [userInput, setUserInput] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  // useMutation
  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update: (_, result) => {
      console.log(result);
      history.push("/");
    },
    onError: (err) => {
      console.log(err.graphQLErrors[0].extensions.errors);
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
  });

  const handleChange = (e) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    registerUser({ variables: userInput });
  };

  return (
    <Row className='bg-white py-5 justify-content-center'>
      <Col sm={8} md={6} lg={4}>
        <h1 className='text-center'>Register</h1>
        <Form onSubmit={handleRegister}>
          <Form.Group>
            <Form.Label className={errors.email && "text-danger"}>
              {errors.email ?? "Email address"}
            </Form.Label>
            <Form.Control
              className={errors.email && "is-invalid"}
              name='email'
              value={userInput.email}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className={errors.username && "text-danger"}>
              {errors.username ?? "Username"}
            </Form.Label>
            <Form.Control
              className={errors.username && "is-invalid"}
              type='text'
              name='username'
              value={userInput.username}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className={errors.password && "text-danger"}>
              {errors.password ?? "Password"}
            </Form.Label>
            <Form.Control
              className={errors.password && "is-invalid"}
              type='password'
              name='password'
              value={userInput.password}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className={errors.confirmPassword && "text-danger"}>
              {errors.confirmPassword ?? "Confirm Password"}
            </Form.Label>
            <Form.Control
              className={errors.confirmPassword && "is-invalid"}
              type='password'
              name='confirmPassword'
              value={userInput.confirmPassword}
              onChange={handleChange}
            />
          </Form.Group>

          <div className='text-center'>
            <Button variant='success' type='submit' disabled={loading}>
              {loading ? "Loading..." : "Register"}
            </Button>
            <div>
              <small>
                Already have an account? <Link to='/login'>Login</Link>
              </small>
            </div>
          </div>
        </Form>
      </Col>
    </Row>
  );
};

export default Register;
