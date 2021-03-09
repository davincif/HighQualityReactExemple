export const initialState = {
  logged: false,
  nick: "",
  name: "",
  email: "",
  birth: "",
  accessLevel: "",
  active: false,
};

export const UserInfoReducer = (state: any, action: any) => {
  let newState = { ...initialState };

  switch (action.type) {
    case "LOGIN":
      newState = {
        logged: true,
        nick: action.data.login.nick,
        name: action.data.login.name,
        email: action.data.login.email,
        birth: action.data.login.birth,
        accessLevel: action.data.login.accessLevel,
        active: action.data.login.active,
      };
      localStorage.setItem("lgd", String(newState.logged));
      break;

    case "LOGOUT":
      newState.logged = false;
      localStorage.removeItem("lgd");
      break;
  }

  return newState;
};
