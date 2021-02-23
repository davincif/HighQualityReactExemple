// Third party libs
import React, { useContext, useEffect } from "react";
import {
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

// Internal imports
import { useStyles } from "./NavbarStyle";
import { LocaleContext } from "../../Reducers/Locale/LocaleContext";
import USFlag from "../Icons/USFlag";
import BrazilianFlag from "../Icons/BrazilianFlag";
import SpanishFlag from "../Icons/SpanishFlag";
import RussianFlag from "../Icons/RussianFlag";
import { get_browser_lang } from "../../Reducers/Locale/Tools";

function Navbar(props?: {}) {
  const { language, dispatch } = useContext(LocaleContext);
  const [langIconAnchorEl, setLangIconAnchorEl] = React.useState(null);
  const classes = useStyles();

  useEffect(() => {
    // setting prefered language
    let lang = localStorage.getItem("lang");
    dispatch({ type: lang ? lang : get_browser_lang() });
  }, []);

  let openLoginIcon = Boolean(langIconAnchorEl);

  const handlerLoginIcon = (event: any) => {
    setLangIconAnchorEl(event.currentTarget);
  };

  const handlerCloseLoginIcon = (event: any, lang?: string) => {
    setLangIconAnchorEl(null);

    // change language if requested
    if (lang) {
      dispatch({ type: lang });
    }
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.nav}>
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" className={classes.title}>
            Family Budget
          </Typography>
          <IconButton
            className={classes.langIcon}
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handlerLoginIcon}
            color="inherit"
          >
            {language.code === "en" ? (
              <USFlag />
            ) : language.code === "pt-br" ? (
              <BrazilianFlag />
            ) : language.code === "es" ? (
              <SpanishFlag />
            ) : language.code === "ru" ? (
              <RussianFlag />
            ) : (
              <div></div>
            )}
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={langIconAnchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={openLoginIcon}
            onClose={(event) => {
              handlerCloseLoginIcon(event);
            }}
          >
            <MenuItem
              onClick={(event) => {
                handlerCloseLoginIcon(event, "us");
              }}
            >
              <USFlag />
            </MenuItem>
            <MenuItem
              onClick={(event) => {
                handlerCloseLoginIcon(event, "pt-br");
              }}
            >
              <BrazilianFlag />
            </MenuItem>
            <MenuItem
              onClick={(event) => {
                handlerCloseLoginIcon(event, "es");
              }}
            >
              <SpanishFlag />
            </MenuItem>
            <MenuItem
              onClick={(event) => {
                handlerCloseLoginIcon(event, "ru");
              }}
            >
              <RussianFlag />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Navbar;
