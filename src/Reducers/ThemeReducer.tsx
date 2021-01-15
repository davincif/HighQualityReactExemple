// Material
import { createMuiTheme } from "@material-ui/core/styles";
import { grey, purple } from "@material-ui/core/colors";

export const initialState = createMuiTheme({
  palette: {
    primary: purple,
    secondary: {
      main: "#FF9700",
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
