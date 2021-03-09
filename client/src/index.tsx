// Third party libs
import React from "react";
import ReactDOM from "react-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { BrowserView, MobileView } from "react-device-detect";

// Internal imports
import "./index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import ThemeContextProdiver from "./Reducers/Theme/ThemeContext";
import LocaleContextProdiver from "./Reducers/Locale/LocaleContext";
import UserInfoContextProdiver from "./Reducers/UserInfo/UserInfoContext";

ReactDOM.render(
  <React.StrictMode>
    <ThemeContextProdiver>
      <LocaleContextProdiver>
        <UserInfoContextProdiver>
          <BrowserView>
            <DndProvider backend={HTML5Backend}>
              <App />
            </DndProvider>
          </BrowserView>
          <MobileView>
            <DndProvider backend={TouchBackend}>
              <App />
            </DndProvider>
          </MobileView>
        </UserInfoContextProdiver>
      </LocaleContextProdiver>
    </ThemeContextProdiver>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
