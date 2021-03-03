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
import { DirType, FSItem } from "../../Utils/FileTree/Models";
import { isFile } from "../../Utils/FileTree/Utils";
import { isEmpty } from "../../Utils/utils";
import { LocaleContext } from "../../Reducers/Locale/LocaleContext";
import { capitalize } from "../../Reducers/Locale/Tools";
import Navbar from "../../Components/Navbar/Navbar";
import Item from "../../Components/Item/Item";

const initialTree: DirType = {
  name: "Home",
  parents: [],
};
const root = new FileTree(initialTree);

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
  const [tree, setTree] = useState(root.getTree());
  const [fileSel, setFileSel] = useState<SelectionData>({
    fname: { selected: false, feedback: VisualFeedBack.NONE },
  });
  const [dirSel, setDirSel] = useState<SelectionData>({
    dname: { selected: false, feedback: VisualFeedBack.NONE },
  });
  const [lastClickedFile, setLastClickedFile] = useState(-1);
  const [lastClickedDir, setLastClickedDir] = useState(-1);

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

  const animate = (
    name: string,
    ani: VisualFeedBack,
    toUpdate: SelectionData,
    timeTimeMs: number,
    isfile: boolean
  ) => {
    if (
      (isfile && fileSel[name].feedback !== ani) ||
      (!isfile && dirSel[name].feedback !== ani)
    ) {
      toUpdate[name].feedback = ani;

      // remove the animaiton feedback status after (x)ms
      setTimeout(() => {
        let toUpdate = isfile ? { ...fileSel } : { ...dirSel };

        if (toUpdate && toUpdate[name] && toUpdate[name].feedback === ani) {
          toUpdate[name].feedback = VisualFeedBack.NONE;
          if (isfile) {
            setFileSel(toUpdate);
          } else {
            setDirSel(toUpdate);
          }
        }
      }, timeTimeMs);
    }
  };

  const onDirClickHandler = (
    name: string,
    selectIt: boolean,
    shiftKey: boolean,
    ctrlKey: boolean
  ) => {
    let toUpdate: SelectionData | undefined;

    if (shiftKey && ctrlKey) {
      if (dirSel[name]) {
        toUpdate = { ...dirSel };

        animate(name, VisualFeedBack.DENY, toUpdate, 700, false);
      }
    } else if (shiftKey) {
      let currentPos = root.getItem(name)[1];
      if (currentPos !== undefined) {
        toUpdate = { ...dirSel };
        if (lastClickedDir === -1) {
          setLastClickedDir(currentPos);
          toUpdate[tree.parents[currentPos].name].selected = selectIt;
        } else {
          let direction = currentPos < lastClickedDir ? 1 : -1;

          for (
            let pos = currentPos;
            pos !== lastClickedDir;
            pos = pos + direction
          ) {
            toUpdate[tree.parents[pos].name].selected = selectIt;
          }

          animate(name, VisualFeedBack.SELECT, toUpdate, 200, false);

          setDirSel(toUpdate);
          setLastClickedDir(-1);
        }
      } else {
        // this shall never happen, but just in case.
        console.error(
          `some unexpected error happend, the current "${name}" dir is not present in the current directory`
        );
      }
    } else if (ctrlKey) {
      if (dirSel[name]) {
        toUpdate = { ...dirSel };

        // select or unselect only the clicked one
        toUpdate[name].selected = selectIt;

        animate(name, VisualFeedBack.SELECT, toUpdate, 200, false);

        // recornd last clicked
        let index = root.getItem(name)[1];
        if (index === undefined) {
          // this shall never happen, but just in case...
          console.error(
            `something really wrong happened, the selected folder ${name} is no in the current dir`
          );
        } else {
          setLastClickedDir(index);
        }
      }
    } else {
      if (dirSel[name]) {
        toUpdate = { ...dirSel };

        // unselect everything
        for (let dir in toUpdate) {
          if (name !== dir) {
            toUpdate[dir].selected = false;
          }
        }

        // select or unselect only the clicked one
        toUpdate[name].selected = selectIt;

        animate(name, VisualFeedBack.SELECT, toUpdate, 200, false);

        // recornd last clicked
        let index = root.getItem(name)[1];
        if (index === undefined) {
          // this shall never happen, but just in case...
          console.error(
            `something really wrong happened, the selected folder ${name} is no in the current dir`
          );
        } else {
          setLastClickedDir(index);
        }
      }
    }

    if (toUpdate) {
      setDirSel(toUpdate);
    }
  };

  const onFileClickHandler = (
    name: string,
    selectIt: boolean,
    shiftKey: boolean,
    ctrlKey: boolean
  ) => {
    let toUpdate: SelectionData | undefined;

    if (shiftKey && ctrlKey) {
      if (fileSel[name]) {
        toUpdate = { ...fileSel };

        animate(name, VisualFeedBack.DENY, toUpdate, 700, true);
      }
    } else if (shiftKey) {
      let currentPos = root.getItem(name)[1];
      if (currentPos !== undefined) {
        toUpdate = { ...fileSel };
        if (lastClickedFile === -1) {
          setLastClickedFile(currentPos);
          toUpdate[tree.parents[currentPos].name].selected = selectIt;
        } else {
          let direction = currentPos < lastClickedFile ? 1 : -1;

          for (
            let pos = currentPos;
            pos !== lastClickedFile;
            pos = pos + direction
          ) {
            toUpdate[tree.parents[pos].name].selected = selectIt;
          }

          animate(name, VisualFeedBack.SELECT, toUpdate, 200, true);

          setFileSel(toUpdate);
          setLastClickedFile(-1);
        }
      } else {
        // this shall never happen, but just in case.
        console.error(
          `some unexpected error happend, the current "${name}" dir is not present in the current directory`
        );
      }
    } else if (ctrlKey) {
      if (fileSel[name]) {
        toUpdate = { ...fileSel };

        // select or unselect only the clicked one
        toUpdate[name].selected = selectIt;

        animate(name, VisualFeedBack.SELECT, toUpdate, 200, true);

        // recornd last clicked
        let index = root.getItem(name)[1];
        if (index === undefined) {
          // this shall never happen, but just in case...
          console.error(
            `something really wrong happened, the selected file ${name} is no in the current dir`
          );
        } else {
          setLastClickedFile(index);
        }
      }
    } else {
      if (fileSel[name]) {
        toUpdate = { ...fileSel };

        // unselect everything
        for (let file in toUpdate) {
          if (name !== file) {
            toUpdate[file].selected = false;
          }
        }

        // select or unselect only the clicked one
        toUpdate[name].selected = selectIt;

        animate(name, VisualFeedBack.SELECT, toUpdate, 200, true);

        // recornd last clicked
        let index = root.getItem(name)[1];
        if (index === undefined) {
          // this shall never happen, but just in case...
          console.error(
            `something really wrong happened, the selected folder ${name} is no in the current dir`
          );
        } else {
          setLastClickedFile(index);
        }
      }
    }

    if (toUpdate) {
      setFileSel(toUpdate);
    }
  };

  const cleanSelecteds = () => {
    // unselect directories
    let toUpdate = { ...dirSel };

    // unselect everything
    for (let dir in toUpdate) {
      toUpdate[dir].selected = false;
    }

    setDirSel(toUpdate);

    // unselect files
    toUpdate = { ...fileSel };

    // unselect everything
    for (let dir in toUpdate) {
      toUpdate[dir].selected = false;
    }

    setFileSel(toUpdate);

    setLastClickedFile(-1);
    setLastClickedDir(-1);
  };

  return (
    <div
      onClick={() => {
        cleanSelecteds();
      }}
    >
      <Navbar />
      <CssBaseline />

      <div className={classes.mainContainer}>
        <Breadcrumbs
          // maxItems={2}
          aria-label="breadcrumb"
          className={classes.breadcrumbs}
        >
          {root.getAdress().map((value, index, addrs) => (
            <Link
              color="inherit"
              // href="/"
              onClick={() => {
                let levels = addrs.length - index - 1;
                if (levels > 0) {
                  root.goUp(levels);
                  setTree(root.getCurrentTree());
                }
              }}
            >
              {value}
            </Link>
          ))}
        </Breadcrumbs>

        {tree.parents.filter((value) => !isFile(value)).length > 0 ? (
          <Typography variant="h5" color="textPrimary">
            {capitalize(language.msgs.folders)}
          </Typography>
        ) : null}

        {/* rendering directories */}
        <div className={classes.flexcont}>
          {tree.parents
            .filter((value) => !isFile(value))
            .map((dir: DirType) => (
              <Item
                folder
                className={
                  dirSel[dir.name]?.feedback === VisualFeedBack.DENY
                    ? classes.deny
                    : dirSel[dir.name]?.feedback === VisualFeedBack.ACTION_ACC
                    ? classes.dropedIn
                    : dirSel[dir.name]?.feedback === VisualFeedBack.SELECT
                    ? classes.pressIn
                    : ""
                }
                name={dir.name}
                itemType="item"
                stopPropagation
                droppableItemType="item"
                selected={dirSel[dir.name]?.selected}
                onClick={(selected, shiftKey, ctrlKey) => {
                  onDirClickHandler(dir.name, selected, shiftKey, ctrlKey);
                }}
                onDoubleClick={() => {
                  let index = root.getItem(dir.name)[1];
                  if (index !== undefined) {
                    root.goIn(index);
                    setTree(root.getCurrentTree());
                  } else {
                    // that should be impossible to happen, but just in case
                    console.error(
                      `The dir "${dir.name}" is not present in the current directory`
                    );
                  }
                }}
                droppedIn={(item) => {
                  let toUpdate: SelectionData | undefined;
                  let selecteds: [FSItem, number][];

                  if ((item as any).name === dir.name) {
                    // cannot move a dir to itself
                    toUpdate = { ...dirSel };
                    animate(
                      dir.name,
                      VisualFeedBack.DENY,
                      toUpdate,
                      300,
                      false
                    );
                  } else {
                    // get all files to be moved
                    selecteds = tree.parents.map((value, index) => {
                      if (
                        value.name === dir.name &&
                        dirSel[dir.name]?.selected
                      ) {
                        toUpdate = { ...dirSel };
                        animate(
                          dir.name,
                          VisualFeedBack.DENY,
                          toUpdate,
                          300,
                          false
                        );

                        return [value, -1];
                      } else {
                        if (
                          dirSel[value.name]?.selected ||
                          fileSel[value.name]?.selected ||
                          (item as any).name === value.name
                        ) {
                          return [value, index];
                        } else {
                          return [value, -1];
                        }
                      }
                    });
                    selecteds = selecteds.filter((value) => value[1] !== -1);

                    // move selected items
                    if (selecteds) {
                      if (!toUpdate) {
                        toUpdate = { ...dirSel };
                      }

                      // delete from the view
                      for (let sel of selecteds) {
                        delete toUpdate[sel[0].name];
                      }
                      // move
                      root.dragItems(
                        selecteds.map((value) => value[1]),
                        tree.parents.indexOf(dir)
                      );

                      // update tree
                      setTree(root.getCurrentTree());
                    }

                    // update infos
                    if (toUpdate) {
                      setDirSel(toUpdate);
                    }
                  }
                }}
              ></Item>
            ))}
        </div>

        <Divider variant="middle" className={classes.divider} />

        {tree.parents.filter((value) => isFile(value)).length > 0 ? (
          <Typography variant="h5" color="textPrimary">
            {capitalize(language.msgs.files)}
          </Typography>
        ) : null}
        <div className={classes.flexcont}>
          {/* rendering files */}
          {tree.parents
            .filter((value) => isFile(value))
            .map((file) => (
              <Item
                className={
                  fileSel[file.name]?.feedback === VisualFeedBack.DENY
                    ? classes.deny
                    : fileSel[file.name]?.feedback === VisualFeedBack.ACTION_ACC
                    ? classes.dropedIn
                    : fileSel[file.name]?.feedback === VisualFeedBack.SELECT
                    ? classes.pressIn
                    : ""
                }
                name={file.name}
                itemType="item"
                stopPropagation
                selected={fileSel[file.name]?.selected}
                onClick={(selected, shiftKey, ctrlKey) => {
                  onFileClickHandler(file.name, selected, shiftKey, ctrlKey);
                }}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default UserHome;
