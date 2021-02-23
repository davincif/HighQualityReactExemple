// Third party libs
import React from "react";
import { CssBaseline } from "@material-ui/core";

// Internal imports
import Navbar from "../../Components/Navbar/Navbar";

function NotFound(args?: {}) {
  return (
    <div>
      <Navbar />
      <CssBaseline />
      <p>Not Found</p>
    </div>
  );
}

export default NotFound;
