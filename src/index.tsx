// Third party libs
import React from "react";
import ReactDOM from "react-dom";

// Internal imports
import "./index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import ThemeContextProdiver from "./Reducers/ThemeContext";

ReactDOM.render(
  <React.StrictMode>
    <ThemeContextProdiver>
      <App />
    </ThemeContextProdiver>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();