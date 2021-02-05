// Third party libs
import React, { createContext, useReducer } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";

// Internal imports
import { ThemeReducer, initialState } from "./ThemeReducer";

export const ThemeContext = createContext({} as any);

const ThemeContextProdiver = (props: any) => {
  const [theme, dispatch] = useReducer(ThemeReducer, initialState);

  return (
    <ThemeContext.Provider value={{ theme, dispatch }}>
      <MuiThemeProvider theme={theme}>{props.children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContextProdiver;
