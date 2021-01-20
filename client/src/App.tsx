// Third party libs
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// Components
import Login from "./Pages/Login/Login";
import NotFound from "./Pages/NotFound/NotFound";

// Internal imports
import "./App.scss";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login}></Route>
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
