// Material
import { createMuiTheme } from "@material-ui/core/styles";
import { grey, purple } from "@material-ui/core/colors";

export const initialState = createMuiTheme({
  palette: {
    type: "dark",
    background: {
      // 01151A
      default: "#01151A",
      paper: "#022933",
    },
    text: {
      primary: "#ffffff",
    },
    primary: {
      dark: "#251D59",
      main: "#5B48D9",
      light: "#8B8FD9",
    },
    secondary: {
      dark: "#804D00",
      main: "#FF9700",
      light: "#FFB319",
    },
    info: {
      dark: "#195915",
      main: "#2B9923",
      light: "#3DD932",
    },
    error: {
      main: "#DB0FB3",
    },
  },
  // status: {
  //   danger: "orange",
  // },
});

export const ThemeReducer = (state: any, action: any) => {
  switch (action.type) {
    case "DARK":
      return createMuiTheme({
        palette: {
          secondary: grey,
          primary: {
            main: "#111111",
          },
        },
      });

    case "LIGHT":
      return initialState;

    default:
      return initialState;
  }
};
