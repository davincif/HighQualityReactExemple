// Third party libs
import React, { useContext } from "react";
import {
  Breadcrumbs,
  Container,
  CssBaseline,
  Divider,
  Typography,
} from "@material-ui/core";
import FolderRoundedIcon from "@material-ui/icons/FolderRounded";
import DescriptionRoundedIcon from "@material-ui/icons/DescriptionRounded";
import Link from "@material-ui/core/Link";

// Internal imports
import { useStyles } from "./UserHomeStyle";
import { LocaleContext } from "../../Reducers/Locale/LocaleContext";
import { capitalize, capitalizeInitials } from "../../Reducers/Locale/Tools";
import Navbar from "../../Components/Navbar/Navbar";

function UserHome(props?: {}) {
  const classes = useStyles();
  const { language } = useContext(LocaleContext);

  return (
    <div>
      <Navbar />
      <CssBaseline />
      <Breadcrumbs
        // maxItems={2}
        aria-label="breadcrumb"
        className={classes.breadcrumbs}
      >
        <Link
          color="inherit"
          href="/"
          // onClick={handleClick}
        >
          Material-UI
        </Link>
        <Link
          color="inherit"
          href="/getting-started/installation/"
          // onClick={handleClick}
        >
          Core
        </Link>
        <Link
          color="textPrimary"
          href="/components/breadcrumbs/"
          // onClick={handleClick}
          aria-current="page"
        >
          Breadcrumb
        </Link>
      </Breadcrumbs>

      <Container className={classes.mainContainer}>
        <Typography variant="h5" color="textPrimary">
          {capitalize(language.msgs.folders)}
        </Typography>
        <div className={classes.flexcont}>
          <FolderRoundedIcon className={classes.icon} />
          <FolderRoundedIcon className={classes.icon} />
        </div>

        <Divider variant="middle" className={classes.divider} />

        <Typography variant="h5" color="textPrimary">
          {capitalize(language.msgs.files)}
        </Typography>
        <div className={classes.flexcont}>
          <DescriptionRoundedIcon className={classes.icon} />
          <DescriptionRoundedIcon className={classes.icon} />
        </div>
      </Container>
    </div>
  );
}

export default UserHome;
