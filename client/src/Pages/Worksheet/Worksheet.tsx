// Third party libs
import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { CssBaseline } from "@material-ui/core";

// Internal imports
import { useStyles } from "./WorksheetStyle";
import { LocaleContext } from "../../Reducers/Locale/LocaleContext";
import Navbar from "../../Components/Navbar/Navbar";
import FamilyMembers from "../../Components/FamilyMembers/FamilyMembers";
import AuthRequired from "../../Components/AuthRequired/AuthRequired";

const mockData = [
  [
    {
      type: "string",
      value: "salary",
    },
    {
      type: "number",
      value: 2130.24,
    },
  ],
  [
    {
      type: "string",
      value: "A gift from grandma in christimas",
    },
    {
      type: "number",
      value: 50,
    },
  ],
  [
    {
      type: "string",
      value: "ôia",
    },
    {
      type: "number",
      value: 1050.27,
    },
  ],
];

function Worksheet(props?: {}) {
  const classes = useStyles();
  const { language } = useContext(LocaleContext);

  console.log("window.location", window.location);

  return (
    <div>
      <AuthRequired />

      <Navbar />
      <CssBaseline />

      <FamilyMembers />
    </div>
  );
}

export default Worksheet;
