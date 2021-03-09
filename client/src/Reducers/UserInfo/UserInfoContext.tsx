// Third party libs
import React, { createContext, useReducer } from "react";

// Internal imports
import { UserInfoReducer, initialState } from "./UserInfoReducer";

export const UserInfoContext = createContext({} as any);

const UserInfoContextProdiver = (props: any) => {
  const [userInfo, infoDispatch] = useReducer(UserInfoReducer, initialState);

  return (
    <UserInfoContext.Provider value={{ userInfo, infoDispatch }}>
      {props.children}
    </UserInfoContext.Provider>
  );
};

export default UserInfoContextProdiver;
