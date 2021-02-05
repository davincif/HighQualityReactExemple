// Third party libs
import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";

// Internal imports
import { ReactComponent as ESFlag } from "../../Icons/spain.svg";

function SpanishFlag(props?: {}) {
  return (
    <SvgIcon {...props}>
      <ESFlag />
    </SvgIcon>
  );
}

export default SpanishFlag;
