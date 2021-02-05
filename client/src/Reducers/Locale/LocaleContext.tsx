// Third party libs
import React, { createContext, useReducer } from "react";

// Internal imports
import { LocaleReducer, initialState } from "./LocaleReducer";

export const LocaleContext = createContext({} as any);

const LocaleContextProdiver = (props: any) => {
  const [language, dispatch] = useReducer(LocaleReducer, initialState);

  return (
    <LocaleContext.Provider value={{ language, dispatch }}>
      {props.children}
    </LocaleContext.Provider>
  );
};

export default LocaleContextProdiver;
