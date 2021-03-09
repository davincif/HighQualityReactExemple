// Third party libs
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CssBaseline,
  Typography,
} from "@material-ui/core";

// Internal imports
import { useStyles } from "./FamilyMembersStyle";
// import { LocaleContext } from "../../Reducers/Locale/LocaleContext";

type FamilyProps = {
  className?: string;
};

function FamilyMembers({ className = "" }: FamilyProps) {
  const classes = useStyles();
  // const { language } = useContext(LocaleContext);

  return (
    <div className={className}>
      <CssBaseline />

      <Card className={classes.card}>
        <CardHeader
          title="Family Members"
          className={classes.title}
        ></CardHeader>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            This impressive paella is a perfect party dish and a fun meal to
            cook together with your guests. Add 1 cup of frozen peas along with
            the mussels, if you like.
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default FamilyMembers;
