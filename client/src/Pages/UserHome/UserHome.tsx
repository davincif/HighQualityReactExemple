// Third party libs
import React, { useContext, useEffect, useState } from "react";
import {
  Breadcrumbs,
  CssBaseline,
  Divider,
  Typography,
} from "@material-ui/core";
import Link from "@material-ui/core/Link";

// Internal imports
import { useStyles } from "./UserHomeStyle";
import { FileTree } from "../../Utils/FileTree/FileTree";
import { DirType } from "../../Utils/FileTree/Models";
import { isFile } from "../../Utils/FileTree/Utils";
import { LocaleContext } from "../../Reducers/Locale/LocaleContext";
import { capitalize } from "../../Reducers/Locale/Tools";
import Navbar from "../../Components/Navbar/Navbar";
import Item from "../../Components/Item/Item";

function UserHome(props?: {}) {
  const classes = useStyles();
  const { language } = useContext(LocaleContext);
  const mockFileTree: any = [
    {
      name: "Xablau",
      parents: [],
    },
    {
      name: "Curió",
      parents: [],
    },
    {
      name: "Sun",
      parents: [],
    },
    {
      name: "Family",
      parents: [],
    },
    {
      name: "Наталья",
      parents: [],
    },
    {
      name: "Jerenilson Bezerra da Silva",
    },
    {
      name: "ñon",
    },
    {
      name: "Лиза",
    },
    {
      name: "Canaã",
    },
    {
      name: "Галина",
    },
  ];
  const initialTree: DirType = {
    name: "Home",
    parents: [],
  };
  const root = new FileTree(initialTree);
  const [tree, setTree] = useState(root.getTree());
  const [fileSel, setFileSel] = useState<{ [name: string]: boolean }>({
    fname: false,
  });
  const [dirSel, setDirSel] = useState<{ [name: string]: boolean }>({
    dname: false,
  });

  useEffect(() => {
    root.loadTree({ ...initialTree, parents: mockFileTree });
    setTree(root.getTree());
  }, []);

  useEffect(() => {
    let selObj: any = {};

    // for file
    for (let item of tree.parents.filter((value) => isFile(value))) {
      selObj[item.name] = false;
    }
    setFileSel(selObj);

    selObj = {};
    // for dir
    for (let item of tree.parents.filter((value) => !isFile(value))) {
      selObj[item.name] = false;
    }
    setDirSel(selObj);
  }, [tree]);

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
          // href="/"
          // onClick={() => {
          //   console.log("click");
          // }}
        >
          Home
        </Link>
      </Breadcrumbs>

      <div className={classes.mainContainer}>
        <Typography variant="h5" color="textPrimary">
          {capitalize(language.msgs.folders)}
        </Typography>
        {/* rendering folders */}
        <div className={classes.flexcont}>
          {tree.parents
            .filter((value) => !isFile(value))
            .map((value) => (
              <Item
                folder
                name={value.name}
                itemType="item"
                stopPropagation={true}
                droppableItemType="item"
              ></Item>
            ))}
        </div>

        <Divider variant="middle" className={classes.divider} />

        <Typography variant="h5" color="textPrimary">
          {capitalize(language.msgs.files)}
        </Typography>
        <div className={classes.flexcont}>
          {/* rendering files */}
          {tree.parents
            .filter((value) => isFile(value))
            .map((value) => (
              <Item name={value.name} itemType="item" stopPropagation={true} />
            ))}
        </div>
      </div>
    </div>
  );
}

export default UserHome;
