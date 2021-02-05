// import { useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { CHECK_USER } from "../../GraphQL/Queries";

function LoginPresenter() {
  // const [check_user, { error, loading, data }] = useLazyQuery(CHECK_USER);
  // const [check_user, { data }] = useLazyQuery(CHECK_USER);
  const [check_user] = useLazyQuery(CHECK_USER);

  // useEffect(() => {
  //   console.log("data", data);
  // }, [data]);

  let handleLogin = async (username: string, password: string) => {
    if (username && password) {
      check_user({ variables: { id: username } });
    }
  };

  return { handleLogin };
}

export default LoginPresenter;
