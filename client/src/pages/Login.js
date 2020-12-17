import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { Row, Col, Form, Button } from "react-bootstrap";
import { gql, useLazyQuery } from "@apollo/client";

// Query
const LOGIN_USER = gql`
  query login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      username
      email
      createdAt
      token
    }
  }
`;

const Login = () => {
  const history = useHistory();

  const [userInput, setUserInput] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  // useLazyQuery -> execute the query once hitting Submit button
  // store token in localStorage
  const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
    onCompleted: (data) => {
      console.log(data);
      localStorage.setItem("token", data.login.token);
      history.push("/");
    },
    onError: (err) => {
      // console.log(err.graphQLErrors[0].extensions.errors);
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
  });

  const handleChange = (e) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    loginUser({ variables: userInput });
  };

  return (
    <Row className='bg-white py-5 justify-content-center'>
      <Col sm={8} md={6} lg={4}>
        <h1 className='text-center'>Login</h1>
        <Form onSubmit={handleLogin}>
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

          <div className='text-center'>
            <Button variant='success' type='submit' disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </Button>
            <div>
              <small>
                Don't have an account? <Link to='/register'>Register</Link>
              </small>
            </div>
          </div>
        </Form>
      </Col>
    </Row>
  );
};

export default Login;
