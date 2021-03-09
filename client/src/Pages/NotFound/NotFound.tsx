// Third party libs
import React from "react";
import { CssBaseline } from "@material-ui/core";

// Internal imports
import Navbar from "../../Components/Navbar/Navbar";
import AuthRequired from "../../Components/AuthRequired/AuthRequired";

function NotFound(args?: {}) {
  return (
    <div>
      <AuthRequired />

      <Navbar />
      <CssBaseline />
      <p>Not Found</p>
    </div>
  );
}

export default NotFound;
