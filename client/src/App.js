import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";
import { ApolloProvider } from "./ApolloProvider";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";

const App = () => {
  return (
    <ApolloProvider>
      <Router>
        <Container className='pt-5'>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/register' component={Register} />
            <Route path='/login' component={Login} />
          </Switch>
        </Container>
      </Router>
    </ApolloProvider>
  );
};

export default App;
