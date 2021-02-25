import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  itemdiv: {
    display: "flex",
    flexDirection: "column",
    flexFlow: "column wrap",
    height: "auto",
    backgroundColor: "transparent",
  },
  icon: {
    margin: theme.spacing("auto", "auto"),
    color: theme.palette.primary.main,
    fontSize: "100px",
  },
  dropWrapper: {
    margin: theme.spacing(0.4, 0.8),
    padding: theme.spacing(0.4, 0.8),
    borderRadius: theme.spacing(1),
  },
  isOver: {
    backgroundColor: theme.palette.background.paper,
  },
  nameLabel: {
    fontSize: theme.typography.body1.fontSize,
    // backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },
}));
