// Third party libs
import React, { useContext, useState } from "react";
import {
  Avatar,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
} from "@material-ui/core";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { AccountCircle } from "@material-ui/icons";

// Internal imports
import { capitalizeInitials } from "../../Reducers/Locale/Tools";
import { LocaleContext } from "../../Reducers/Locale/LocaleContext";
import Navbar from "../../Components/Navbar/Navbar";
import { useStyles } from "./SingUpStyle";
import SignUpPresenter from "./SignUpPresenter";

function SignUp(props?: {}) {
  const { language } = useContext(LocaleContext);

  const [nick, setNick] = useState({ value: "", errmsg: "" });
  const [password, setPassword] = useState({ value: "", errmsg: "" });
  const [cPassword, setCpassword] = useState({ value: "", errmsg: "" });
  const [email, setEmail] = useState({ value: "", errmsg: "" });
  const [name, setName] = useState({ value: "", error: false, errmsg: "" });
  const [selectedDate, setSelectedDate] = useState({
    value: new Date("99/99/99"),
    error: false,
    errmsg: "",
  });

  const {
    handleCreateUser,
    nickValidation,
    passwordValidation,
    cPasswordValidation,
    emailValidation,
    nameValidation,
    dateValidation,
    validateAll,
  } = SignUpPresenter({ language });
  const classes = useStyles();

  const handleDateChange = (date: any) => {
    // protect against catastrophic failure
    if (date) {
      setSelectedDate({ ...selectedDate, value: date });
    }
  };

  const HandleConfirm = () => {
    let allvalid = validateAll({
      nick,
      setNick,
      password,
      setPassword,
      cPassword,
      setCpassword,
      email,
      setEmail,
      name,
      setName,
      selectedDate,
      setSelectedDate,
    });

    console.log("allvalid", allvalid);
    if (allvalid) {
      handleCreateUser(
        nick.value,
        password.value,
        cPassword.value,
        email.value,
        name.value,
        selectedDate.value
      )
        .then((data) => {
          console.log("handleCreateUser data", data);
        })
        .catch((err) => {
          console.log("handleCreateUser err", err);
        });
    }
  };

  return (
    <div>
      <Navbar></Navbar>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <AccountCircle />
          </Avatar>
          <Typography component="h1" variant="h5">
            {capitalizeInitials(language.msgs.sign_up)}
          </Typography>
          <form className={classes.form}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="usernick"
              label={language.msgs.nick}
              name="usernick"
              autoComplete="usernick"
              autoFocus
              onChange={(e) => setNick({ ...nick, value: e.target.value })}
              error={!!nick.errmsg}
              helperText={nick.errmsg}
              onBlur={() => {
                nickValidation({ nick, setNick });
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label={language.msgs.password}
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) =>
                setPassword({ ...password, value: e.target.value })
              }
              onBlur={() => {
                passwordValidation({ password, setPassword });
              }}
              error={!!password.errmsg}
              helperText={password.errmsg}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label={language.msgs.confirmPassword}
              type="password"
              id="confirmPassword"
              onChange={(e) =>
                setCpassword({ ...cPassword, value: e.target.value })
              }
              onBlur={() => {
                cPasswordValidation({
                  cPassword,
                  setCpassword,
                  password,
                  setPassword,
                });
              }}
              error={!!cPassword.errmsg}
              helperText={cPassword.errmsg}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label={language.msgs.email}
              type="email"
              name="useremail"
              autoComplete="email"
              onChange={(e) => setEmail({ ...email, value: e.target.value })}
              onBlur={() => {
                emailValidation({ email, setEmail });
              }}
              error={!!email.errmsg}
              helperText={email.errmsg}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="name"
              label={language.msgs.name}
              name="username"
              autoComplete="username"
              onChange={(e) => setName({ ...name, value: e.target.value })}
              onBlur={() => {
                nameValidation({ name, setName });
              }}
              error={!!name.errmsg}
              helperText={name.errmsg}
            />
            {/* <TextField
              id="userbirth"
              label="Next appointment"
              type="date"
              // defaultValue="2017-05-24T10:30"
              // className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            /> */}
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                variant="inline"
                format="dd/MM/yyyy"
                margin="normal"
                views={["year", "month", "date"]}
                id="userbirth"
                label={language.msgs.birth_date}
                value={selectedDate.value}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
                onBlur={() => {
                  dateValidation({ selectedDate, setSelectedDate });
                }}
                error={!!selectedDate.errmsg}
                helperText={selectedDate.errmsg}
              />
            </MuiPickersUtilsProvider>
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={HandleConfirm}
            >
              {capitalizeInitials(language.msgs.confirm)}
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}

export default SignUp;
