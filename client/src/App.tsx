// Third party libs
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {
  ApolloLink,
  ApolloProvider,
  concat,
  from,
  HttpLink,
} from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

// Pages
import Login from "./Pages/Login/Login";
import NotFound from "./Pages/NotFound/NotFound";
import SignUp from "./Pages/SignUp/SingUp";
import Family from "./Pages/Family/Family";
import UserHome from "./Pages/UserHome/UserHome";
import Worksheet from "./Pages/Worksheet/Worksheet";

// Internal imports
import "./App.scss";

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.map((message, location, path) => {
      console.log(`Graphql error `, message, location, path);
      return message;
    });
  } else if (networkError) {
    console.log(`networkError error ${networkError}`);
  }

  // const { response } = operation.getContext();
  // const { headers, status } = response;
});

const link = from([
  errorLink,
  new HttpLink({
    uri: "http://localhost:4000/graphql",
    credentials: "same-origin",
  }),
]);

// const authMiddleware = new ApolloLink((operation, forward) => {
//   // add the authorization to the headers
//   operation.setContext({
//     headers: {
//       Authorization: `JWT ${
//         localStorage.getItem("token") || "XABLAUAUAUAUAUAUAUAUA"
//       }`,
//     },
//   });

//   // const context = operation.getContext();
//   // const authHeader = context.response.headers.get("Authorization");
//   // console.log("context", context);

//   return forward(operation);
// });

const client = new ApolloClient({
  // link: concat(authMiddleware, link),
  link: link,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/family" component={Family} />
          <Route exact path="/userhome" component={UserHome} />
          <Route exact path="/worksheet" component={Worksheet} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </ApolloProvider>
  );
}

export default App;
