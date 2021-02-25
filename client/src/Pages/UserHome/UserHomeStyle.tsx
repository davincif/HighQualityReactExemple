import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  mainContainer: {
    // marginTop: theme.spacing(2),
    margin: theme.spacing(2),
    padding: theme.spacing(0, 1),
    textAlign: "center",
  },
  flexcont: {
    display: "flex",
    flexDirection: "row",
    flexFlow: "row wrap",
    height: "auto",
    borderRadius: theme.spacing(1),
  },
  breadcrumbs: {
    margin: "8px",
  },
  divider: {
    margin: theme.spacing(3, "auto"),
  },
}));
