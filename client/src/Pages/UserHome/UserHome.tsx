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
import { VisualFeedBack, SelectionData } from "./UserHomeModel";
import { FileTree } from "../../Utils/FileTree/FileTree";
import { DirType } from "../../Utils/FileTree/Models";
import { isFile } from "../../Utils/FileTree/Utils";
import { isEmpty } from "../../Utils/utils";
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
  const [fileSel, setFileSel] = useState<SelectionData>({
    fname: { selected: false, feedback: VisualFeedBack.NONE },
  });
  const [dirSel, setDirSel] = useState<SelectionData>({
    dname: { selected: false, feedback: VisualFeedBack.NONE },
  });

  useEffect(() => {
    root.loadTree({ ...initialTree, parents: mockFileTree });
    setTree(root.getTree());
  }, []);

  useEffect(() => {
    let selObj: any = {};

    // for file
    for (let item of tree.parents.filter((value) => isFile(value))) {
      selObj[item.name] = { selected: false, feedback: VisualFeedBack.NONE };
    }

    if (!isEmpty(selObj)) {
      setFileSel(selObj);
    }

    selObj = {};
    // for dir
    for (let item of tree.parents.filter((value) => !isFile(value))) {
      selObj[item.name] = { selected: false, feedback: VisualFeedBack.NONE };
    }

    if (!isEmpty(selObj)) {
      setDirSel(selObj);
    }
  }, [tree]);

  const onDirClickItemHandler = (
    name: string,
    selectIt: boolean,
    shiftKey: boolean,
    ctrlKey: boolean
  ) => {
    let toUpdate: SelectionData | undefined;

    if (shiftKey && ctrlKey) {
      if (dirSel[name]) {
        toUpdate = { ...dirSel };

        // animation
        if (dirSel[name].feedback !== VisualFeedBack.DENY) {
          toUpdate[name].feedback = VisualFeedBack.DENY;

          // remove the animaiton feedback status after 1s
          setTimeout(() => {
            let toUpdate = { ...dirSel };

            if (
              toUpdate &&
              toUpdate[name] &&
              toUpdate[name].feedback === VisualFeedBack.DENY
            ) {
              toUpdate[name].feedback = VisualFeedBack.NONE;
              setDirSel(toUpdate);
            }
          }, 1000);
        }
      }
    } else if (shiftKey) {
    } else if (ctrlKey) {
      if (dirSel[name]) {
        toUpdate = { ...dirSel };

        // select or unselect only the clicked one
        toUpdate[name].selected = !toUpdate[name].selected;

        // animation
        if (dirSel[name].feedback !== VisualFeedBack.SELECT) {
          toUpdate[name].feedback = VisualFeedBack.SELECT;

          // remove the animaiton feedback status after 1s
          setTimeout(() => {
            let toUpdate = { ...dirSel };

            if (
              toUpdate &&
              toUpdate[name] &&
              toUpdate[name].feedback === VisualFeedBack.SELECT
            ) {
              toUpdate[name].feedback = VisualFeedBack.NONE;
              setDirSel(toUpdate);
            }
          }, 200);
        }
      }
    } else {
      if (dirSel[name]) {
        toUpdate = { ...dirSel };

        // unselect everything
        for (let dir in toUpdate) {
          toUpdate[dir].selected = false;
        }

        // select or unselect only the clicked one
        toUpdate[name].selected = !toUpdate[name].selected;

        // animation
        if (dirSel[name].feedback !== VisualFeedBack.SELECT) {
          toUpdate[name].feedback = VisualFeedBack.SELECT;

          // remove the animaiton feedback status after 1s
          setTimeout(() => {
            let toUpdate = { ...dirSel };

            if (
              toUpdate &&
              toUpdate[name] &&
              toUpdate[name].feedback === VisualFeedBack.SELECT
            ) {
              toUpdate[name].feedback = VisualFeedBack.NONE;
              setDirSel(toUpdate);
            }
          }, 200);
        }
      }
    }

    if (toUpdate) {
      setDirSel(toUpdate);
    }
  };

  const cleanSelecteds = () => {
    let toUpdate = { ...dirSel };

    // unselect everything
    for (let dir in toUpdate) {
      toUpdate[dir].selected = false;
    }

    setDirSel(toUpdate);
  };

  return (
    <div
      onClick={() => {
        cleanSelecteds();
      }}
    >
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
                className={
                  dirSel[value.name]?.feedback === VisualFeedBack.DENY
                    ? classes.deny
                    : dirSel[value.name]?.feedback === VisualFeedBack.ACTION_ACC
                    ? classes.dropedIn
                    : dirSel[value.name]?.feedback === VisualFeedBack.SELECT
                    ? classes.pressIn
                    : ""
                }
                name={value.name}
                itemType="item"
                stopPropagation={true}
                droppableItemType="item"
                selected={dirSel[value.name]?.selected}
                onClick={(selected, shiftKey, ctrlKey) => {
                  onDirClickItemHandler(
                    value.name,
                    selected,
                    shiftKey,
                    ctrlKey
                  );
                }}
                droppedIn={() => {
                  // code
                }}
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
