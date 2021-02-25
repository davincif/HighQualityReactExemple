import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  itemdiv: {
    backgroundColor: "transparent",
  },
  icon: {
    color: theme.palette.primary.main,
    fontSize: "100px",
    margin: "5px 10px",
  },
  dropWrapper: {
    borderRadius: theme.spacing(1),
  },
  isOver: {
    backgroundColor: theme.palette.background.paper,
  },
}));
