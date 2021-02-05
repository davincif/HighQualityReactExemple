// Third party libs
import React, { useContext, useState } from "react";

import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { LocaleContext } from "../../Reducers/Locale/LocaleContext";
import { capitalize, capitalizeInitials } from "../../Reducers/Locale/Tools";

// Internal imports
import { useStyles } from "./LoginStyle";
import LoginPresenter from "./LoginPresenter";
import Navbar from "../../Components/Navbar/Navbar";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

function Login(props?: {}) {
  const { language } = useContext(LocaleContext);

  const { handleLogin } = LoginPresenter();

  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <Navbar></Navbar>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {capitalizeInitials(language.msgs.sign_in)}
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label={language.msgs.nick}
              name="username"
              autoComplete="username"
              autoFocus
              onChange={(e) => setUsername(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label={capitalize(language.msgs.remember_me)}
            />
            <Button
              // type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={() => handleLogin(username, password)}
            >
              {capitalizeInitials(language.msgs.sign_in)}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  {capitalize(language.msgs.forgot_password_q)}
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {/* {"Don't have an account? Sign Up"} */}
                  {capitalize(language.msgs.dont_have_an_account_q)}{" "}
                  {capitalizeInitials(language.msgs.sign_up)}
                </Link>
              </Grid>
            </Grid>
          </form>
          {/* <Button
          // type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={() => dispatch({ type: "DARK" })}
        >
          Dark Theme
        </Button> */}
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </div>
  );
}

export default Login;
