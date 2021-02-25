// Third party libs
import React, { useContext, useState } from "react";
import {
  Breadcrumbs,
  CssBaseline,
  Divider,
  Typography,
} from "@material-ui/core";
import Link from "@material-ui/core/Link";

// Internal imports
import { useStyles } from "./UserHomeStyle";
import { FileTree } from "./UserHomeModel";
import { LocaleContext } from "../../Reducers/Locale/LocaleContext";
import { capitalize } from "../../Reducers/Locale/Tools";
import Navbar from "../../Components/Navbar/Navbar";
import Item from "../../Components/Item/Item";

function UserHome(props?: {}) {
  const classes = useStyles();
  const { language } = useContext(LocaleContext);
  const mockFileTree: FileTree = {
    Xablau: {
      name: "Xablau",
      insideFiles: {},
    },
    Curió: {
      name: "Curió",
      insideFiles: {},
    },
    Наталья: {
      name: "Наталья",
      insideFiles: {},
    },
    "Jerenilson Bezerra da Silva": {
      name: "Jerenilson Bezerra da Silva",
    },
    Canaã: {
      name: "Canaã",
    },
    Галина: {
      name: "Галина",
    },
  };
  const [fileTree, setFileTree] = useState(mockFileTree);

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

      <div className={classes.mainContainer}>
        <Typography variant="h5" color="textPrimary">
          {capitalize(language.msgs.folders)}
        </Typography>
        {/* rendering folders */}
        <div className={classes.flexcont}>
          {Object.values(mockFileTree)
            .filter((value) => value.insideFiles === undefined)
            .map((value) => (
              <Item
                name={value.name}
                itemType="item"
                droppableItemType="item"
                folder
              />
            ))}
        </div>

        <Divider variant="middle" className={classes.divider} />

        <Typography variant="h5" color="textPrimary">
          {capitalize(language.msgs.files)}
        </Typography>
        <div className={classes.flexcont}>
          {/* rendering files */}
          {Object.values(mockFileTree)
            .filter((value) => value.insideFiles !== undefined)
            .map((value) => (
              <Item name={value.name} itemType="item" />
            ))}
        </div>
      </div>
    </div>
  );
}

export default UserHome;
