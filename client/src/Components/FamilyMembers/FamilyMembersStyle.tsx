import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  card: {
    margin: theme.spacing(2),
  },
  title: {
    textAlign: "center",
    fontSize: theme.typography.h1.fontSize,
  },
}));
