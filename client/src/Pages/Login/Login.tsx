// Third party libs
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { FetchResult, useLazyQuery } from "@apollo/client";

// material-ui
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Grid,
  Link,
  TextField,
  Typography,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

// Internal imports
import { useStyles } from "./LoginStyle";
import LoginPresenter from "./LoginPresenter";
import { LocaleContext } from "../../Reducers/Locale/LocaleContext";
import { capitalize, capitalizeInitials } from "../../Reducers/Locale/Tools";
import { UserInfoContext } from "../../Reducers/UserInfo/UserInfoContext";
import Navbar from "../../Components/Navbar/Navbar";

function Login(props?: {}) {
  const { language } = useContext(LocaleContext);
  const { infoDispatch } = useContext(UserInfoContext);

  const history = useHistory();

  const [usernick, setUsernick] = useState("");
  const [password, setPassword] = useState("");
  const { user_login, user_login_loading } = LoginPresenter();

  const classes = useStyles();

  const handlerLogin = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    console.log("user_login_loading", user_login_loading);
    if (usernick && password) {
      let ret: any; // FetchResult<any, Record<string, any>, Record<string, any>>
      try {
        ret = await user_login({
          variables: { nick: usernick, password: password },
        });
      } catch (error) {
        console.error("error", error);
      }

      if (ret) {
        if (ret.data.login) {
          infoDispatch({ type: "LOGIN", data: ret.data });
          history.push("/userhome");
        } else {
          infoDispatch({ type: "LOGOUT" });
        }
      }
    }
  };

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
          <form className={classes.form} autoComplete="off" noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="usernick"
              label={language.msgs.nick}
              name="usernick"
              autoFocus
              onChange={(e) => setUsernick(e.target.value)}
              disabled={user_login_loading}
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
              onChange={(e) => setPassword(e.target.value)}
              disabled={user_login_loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handlerLogin}
              disabled={user_login_loading}
            >
              {user_login_loading ? (
                <CircularProgress />
              ) : (
                <div>{capitalizeInitials(language.msgs.sign_in)}</div>
              )}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  {capitalize(language.msgs.forgot_password_q)}
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {capitalize(language.msgs.dont_have_an_account_q)}{" "}
                  {capitalizeInitials(language.msgs.sign_up)}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={8}>
          <Typography variant="body2" color="textSecondary" align="center">
            Copyright © davincif 2021.
          </Typography>
        </Box>
      </Container>
    </div>
  );
}

export default Login;
