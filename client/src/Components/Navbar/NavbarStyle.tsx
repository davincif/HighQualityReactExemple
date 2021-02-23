// Third party libs
import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  nav: {
    backgroundColor: theme.palette.primary.dark,
  },
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  langIcon: {},
}));
