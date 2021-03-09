// Third party libs
import React, { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";

// Internal imports
import { UserInfoContext } from "../../Reducers/UserInfo/UserInfoContext";

function AuthRequired(props?: {}) {
  const { userInfo } = useContext(UserInfoContext);
  const [logged, setLogged] = useState(true);

  useEffect(() => {
    setLogged(localStorage.getItem("lgd") === "true");
  }, []);

  const isLogged = () => {
    return userInfo.logged || logged;
  };

  return (
    <div>
      {/* Loging Protection */}
      {!isLogged() ? (
        <Redirect
          to={{ pathname: "/", state: { from: `${window.location}` } }}
        />
      ) : null}
    </div>
  );
}

export default AuthRequired;
