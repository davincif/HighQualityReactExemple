// Third party libs
import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";

// Internal imports
import { ReactComponent as BRFlag } from "../../Icons/brazil.svg";

function BrazilianFlag(props?: {}) {
  return (
    <SvgIcon {...props}>
      <BRFlag />
    </SvgIcon>
  );
}

export default BrazilianFlag;
