// Third party libs
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ApolloProvider, from, HttpLink } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

// Pages
import Login from "./Pages/Login/Login";
import NotFound from "./Pages/NotFound/NotFound";
import SignUp from "./Pages/SignUp/SingUp";
import Family from "./Pages/Family/Family";

// Internal imports
import "./App.scss";

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map((message, location, path) => {
      console.log(`Graphql error `, message, location, path);
      return message;
    });
  } else if (networkError) {
    console.log(`networkError error ${networkError}`);
  }
});

const link = from([errorLink, new HttpLink({ uri: "http://localhost:4000" })]);

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Switch>
          <Route exact path="/" component={Login}></Route>
          <Route exact path="/signup" component={SignUp}></Route>
          <Route exact path="/family" component={Family}></Route>
          <Route component={NotFound} />
        </Switch>
      </Router>
    </ApolloProvider>
  );
}

export default App;
