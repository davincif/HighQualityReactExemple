import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  mainContainer: {
    // marginTop: theme.spacing(2),
    margin: theme.spacing(2),
    padding: theme.spacing(0, 1),
    // textAlign: "center",
  },
  flexcont: {
    display: "flex",
    flexDirection: "row",
    flexFlow: "row wrap",
    height: "auto",
    borderRadius: theme.spacing(1),
    textAlign: "center",
  },
  breadcrumbs: {
    marginBottom: theme.spacing(2),
  },
  divider: {
    margin: theme.spacing(3, "auto"),
  },
  deny: {
    animation: "$deny 0.1s ease alternate",
    animationDelay: "0.1s",
    animationIterationCount: 6,
  },
  noAnimation: {
    animation: "",
  },
  dropedIn: {
    animation: "$dropedIn 0.5s ease",
    animationDelay: "0.1s",
  },
  pressIn: {
    animation: "$pressIn 0.15s linear",
  },
  "@keyframes pressIn": {
    "0%": {
      transform: "scale(1)",
    },
    "50%": {
      transform: "scale(0.95)",
    },
    "100%": {
      transform: "scale(1)",
    },
  },
  "@keyframes dropedIn": {
    "0%": {
      transform: "scale(0.95)",
    },
    "50%": {
      transform: "scale(1.05)",
    },
    "100%": {
      transform: "scale(1)",
    },
  },
  "@keyframes deny": {
    "0%": {
      transform: "translatex(-5%)",
    },
    "100%": {
      transform: "translatex(+5%)",
    },
  },
}));
