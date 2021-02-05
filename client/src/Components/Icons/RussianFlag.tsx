// Third party libs
import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";

// Internal imports
import { ReactComponent as RUFlag } from "../../Icons/russia.svg";

function RussianFlag(props?: {}) {
  return (
    <SvgIcon {...props}>
      <RUFlag />
    </SvgIcon>
  );
}

export default RussianFlag;
