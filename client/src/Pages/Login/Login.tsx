// Third party libs
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";

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
import { LocaleContext } from "../../Reducers/Locale/LocaleContext";
import { capitalize, capitalizeInitials } from "../../Reducers/Locale/Tools";
import { UserInfoContext } from "../../Reducers/UserInfo/UserInfoContext";
import Navbar from "../../Components/Navbar/Navbar";
import { USER_LOGIN } from "../../GraphQL/Queries";

function Login(props?: {}) {
  const { language } = useContext(LocaleContext);
  const { infoDispatch } = useContext(UserInfoContext);

  const history = useHistory();

  const [usernick, setUsernick] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [user_login, { error, data }] = useLazyQuery(USER_LOGIN);

  const classes = useStyles();

  useEffect(() => {
    setLoading(false);

    if (error) {
      console.error("error", error);
    } else if (data) {
      if (data.login) {
        infoDispatch({ type: "LOGIN", data });
        history.push("/userhome");
      } else {
        infoDispatch({ type: "LOGOUT" });
      }
    }
  }, [error, data]);

  const handlerLogin = () => {
    setLoading(true);
    if (usernick && password) {
      user_login({ variables: { nick: usernick, password: password } });
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
          <form className={classes.form} noValidate>
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
              onChange={(e) => setUsernick(e.target.value)}
              disabled={loading}
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
              disabled={loading}
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label={capitalize(language.msgs.remember_me)}
              disabled={loading}
            /> */}
            <Button
              // type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handlerLogin}
              disabled={loading}
            >
              {loading ? (
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
