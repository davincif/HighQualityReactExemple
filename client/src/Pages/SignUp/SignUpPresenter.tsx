// Third party libs
import { useMutation } from "@apollo/client";

// Internal imports
import { CREATE_USER } from "../../GraphQL/Queries";
import { capitalize } from "../../Reducers/Locale/Tools";

type formField = {
  value: any;
  errmsg: string;
};

function SignUpPresenter(props: { language: any }) {
  const [create_user] = useMutation(CREATE_USER);

  const handleCreateUser = async (
    nick: string,
    password: string,
    cPassword: string,
    email: string,
    name: string,
    selectedDate: Date
  ) => {
    let date = `${selectedDate.getDate()}/${selectedDate.getMonth()}/${selectedDate.getFullYear()}`;

    // check passwords
    if (password === cPassword) {
      return create_user({
        variables: {
          data: {
            nick: nick,
            name: password,
            password: email,
            email: name,
            birth: date,
            accessLevel: "family",
          },
        },
      });
    }
  };

  const nickValidation = (field: {
    nick: formField;
    setNick: React.Dispatch<React.SetStateAction<any>>;
  }) => {
    let isvalid = false;

    const { nick, setNick } = field;
    let minimumSize = 3;

    if (nick.value.length === 0) {
      setNick({
        ...nick,
        errmsg: capitalize(props.language.msgs.empyt_field + "."),
      });
    } else if (nick.value.length < minimumSize) {
      setNick({
        ...nick,
        errmsg: capitalize(
          `${props.language.msgs.field_too_short} ${minimumSize}.`
        ),
      });
    } else {
      if (nick.errmsg) {
        setNick({
          ...nick,
          errmsg: "",
        });
      }

      isvalid = true;
    }

    return isvalid;
  };

  const passwordValidation = (field: {
    password: formField;
    setPassword: React.Dispatch<React.SetStateAction<any>>;
  }) => {
    let isvalid = false;

    const { password, setPassword } = field;
    let minimumSize = 6;

    if (password.value.length === 0) {
      setPassword({
        ...password,
        errmsg: capitalize(props.language.msgs.empyt_field + "."),
      });
    } else if (password.value.length < minimumSize) {
      setPassword({
        ...password,
        errmsg: capitalize(
          `${props.language.msgs.field_too_short} ${minimumSize}.`
        ),
      });
    } else {
      if (password.errmsg) {
        setPassword({
          ...password,
          errmsg: "",
        });
      }

      isvalid = true;
    }

    return isvalid;
  };

  const cPasswordValidation = (field: {
    cPassword: formField;
    setCpassword: React.Dispatch<React.SetStateAction<any>>;
    password?: formField;
    setPassword?: React.Dispatch<React.SetStateAction<any>>;
  }) => {
    let isvalid = false;

    const { cPassword, setCpassword, password, setPassword } = field;

    let minimumSize = 6;

    if (cPassword.value.length === 0) {
      setCpassword({
        ...cPassword,
        errmsg: capitalize(props.language.msgs.empyt_field + "."),
      });
    } else if (cPassword.value.length < minimumSize) {
      setCpassword({
        ...cPassword,
        errmsg: capitalize(
          `${props.language.msgs.field_too_short} ${minimumSize}.`
        ),
      });
    } else if (
      password &&
      password.value &&
      password.value !== cPassword.value
    ) {
      let msg = capitalize(props.language.msgs.password_not_match);
      if (setPassword) {
        setPassword({
          ...password,
          errmsg: msg,
        });
      }
      setCpassword({
        ...cPassword,
        errmsg: msg,
      });
    } else {
      if (cPassword.errmsg) {
        setCpassword({
          ...cPassword,
          errmsg: "",
        });
      }

      if (password && setPassword) {
        passwordValidation({ password, setPassword });
      }

      isvalid = true;
    }

    return isvalid;
  };

  const emailValidation = (field: {
    email: formField;
    setEmail: React.Dispatch<React.SetStateAction<any>>;
  }) => {
    let isvalid = false;

    const { email, setEmail } = field;
    const regEmail = new RegExp(/\w*@\w*.\w*/g);

    if (email.value.length === 0) {
      setEmail({
        ...email,
        errmsg: capitalize(props.language.msgs.empyt_field + "."),
      });
    } else if (!regEmail.test(email.value)) {
      setEmail({
        ...email,
        errmsg: capitalize(props.language.msgs.email_sounds_incorrect + "."),
      });
    } else {
      if (email.errmsg) {
        setEmail({
          ...email,
          errmsg: "",
        });
      }

      isvalid = true;
    }

    return isvalid;
  };

  const nameValidation = (field: {
    name: formField;
    setName: React.Dispatch<React.SetStateAction<any>>;
  }) => {
    let isvalid = false;

    const { name, setName } = field;
    if (name.value.length === 0) {
      setName({
        ...name,
        errmsg: capitalize(props.language.msgs.empyt_field + "."),
      });
    } else {
      if (name.errmsg) {
        setName({
          ...name,
          errmsg: "",
        });
      }

      isvalid = true;
    }

    return isvalid;
  };

  const dateValidation = (field: {
    selectedDate: formField;
    setSelectedDate: React.Dispatch<React.SetStateAction<any>>;
  }) => {
    let isvalid = false;

    const { selectedDate, setSelectedDate } = field;
    // check if date is valid
    if (isNaN(selectedDate.value.getTime())) {
      setSelectedDate({
        ...selectedDate,
        errmsg: capitalize(props.language.msgs.invalid_input + "."),
      });
    } else {
      if (selectedDate.errmsg) {
        setSelectedDate({
          ...selectedDate,
          errmsg: "",
        });
      }

      isvalid = true;
    }

    return isvalid;
  };

  const validateAll = (fields: {
    nick: formField;
    setNick: React.Dispatch<React.SetStateAction<any>>;
    password: formField;
    setPassword: React.Dispatch<React.SetStateAction<any>>;
    cPassword: formField;
    setCpassword: React.Dispatch<React.SetStateAction<any>>;
    email: formField;
    setEmail: React.Dispatch<React.SetStateAction<any>>;
    name: formField;
    setName: React.Dispatch<React.SetStateAction<any>>;
    selectedDate: formField;
    setSelectedDate: React.Dispatch<React.SetStateAction<any>>;
  }) => {
    const valfuncs = [
      nickValidation,
      passwordValidation,
      cPasswordValidation,
      emailValidation,
      nameValidation,
      dateValidation,
    ];

    // trim all entries
    let idx = 0;
    let tolist = Object.keys(fields);
    while (idx < tolist.length) {
      let str: string = tolist[idx];
      if (
        (fields as any)[str].value &&
        typeof (fields as any)[str].value === "string"
      ) {
        let trimed = (fields as any)[str].value.trim();
        if (trimed !== (fields as any)[str].value) {
          (fields as any)[tolist[idx + 1]]({
            ...(fields as any)[str],
            value: trimed,
          });
        }
      }

      idx += 2;
    }

    // check all validations
    return valfuncs.map((fun) => fun(fields)).every((val: any) => val === true);
  };

  return {
    handleCreateUser,
    nickValidation,
    passwordValidation,
    cPasswordValidation,
    emailValidation,
    nameValidation,
    dateValidation,
    validateAll,
  };
}

export default SignUpPresenter;
