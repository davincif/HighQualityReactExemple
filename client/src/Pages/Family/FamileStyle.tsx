// Third party libs
import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  mainContainer: {
    display: "flex",
    flexDirection: "row",
    flexFlow: "row wrap",
    height: "auto",
  },
  avatarWrapper: {
    textAlign: "center",
    margin: "20px 20px",
    flex: "1 0 21%",
  },
  avatar: {
    margin: "0 auto 10px auto",
    fontSize: "80px",
    height: "120px",
    width: "120px",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  avatarName: {
    fontSize: "20px",
  },
  add: {
    backgroundColor: theme.palette.info.main,
    "&:hover": {
      backgroundColor: theme.palette.info.light,
    },
  },
  plusIcon: {
    fontSize: "60px",
  },
  userSearchModal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));
