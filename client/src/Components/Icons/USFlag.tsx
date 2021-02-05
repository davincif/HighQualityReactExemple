// Third party libs
import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";

// Internal imports
import { ReactComponent as UnitedStatesFlag } from "../../Icons/united-states.svg";

function USFlag(props?: {}) {
  return (
    <SvgIcon {...props}>
      <UnitedStatesFlag />
    </SvgIcon>
  );
}

export default USFlag;
