// Third party libs
import { useMutation } from "@apollo/client";

// Internal imports
import { USER_LOGIN } from "../../GraphQL/Mutations";

function LoginPresenter() {
  const [user_login, { loading }] = useMutation(USER_LOGIN);

  return {
    user_login,
    user_login_loading: loading,
  };
}

export default LoginPresenter;
