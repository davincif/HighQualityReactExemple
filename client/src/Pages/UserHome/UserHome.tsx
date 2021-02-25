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
import { FileTree, Item as ItemModel } from "./UserHomeModel";
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
    Sun: {
      name: "Sun",
      insideFiles: {},
    },
    Family: {
      name: "Family",
      insideFiles: {},
    },
    Наталья: {
      name: "Наталья",
      insideFiles: {},
    },
    "Jerenilson Bezerra da Silva": {
      name: "Jerenilson Bezerra da Silva",
    },
    ñon: {
      name: "ñon",
    },
    Лиза: {
      name: "Лиза",
    },
    Canaã: {
      name: "Canaã",
    },
    Галина: {
      name: "Галина",
    },
  };
  const [fileTree, setFileTree] = useState(mockFileTree);
  const [address, setAddress] = useState(["/"]);
  const [selectedFiles, setSelectedFiles] = useState<{
    [name: string]: boolean;
  }>({});
  const [selectedFolders, setSelectedFolders] = useState<{
    [name: string]: boolean;
  }>({});
  const [lastClickedFile, setLastClickedFile] = useState("");
  const [lastClickedFolder, setLastClickedFolder] = useState("");

  useEffect(() => {
    // for folders
    cleanSelecteds();
  }, []);

  const cleanSelecteds = () => {
    // clean selection on folders
    let selectFolders: any = {};
    for (let sel of Object.values(fileTree).filter(
      (value) => value.insideFiles !== undefined
    )) {
      selectFolders[sel.name] = false;
    }
    setSelectedFolders(selectFolders);

    // clean selection on files
    let selectFiles: any = {};
    for (let sel of Object.values(fileTree).filter(
      (value) => value.insideFiles === undefined
    )) {
      selectFiles[sel.name] = false;
    }
    setSelectedFiles(selectFiles);

    // last touched
    setLastClickedFile("");
    setLastClickedFolder("");
  };

  const onClickItemHandler = (
    thisItem: ItemModel,
    isSelected: boolean,
    shiftKey: boolean,
    ctrlKey: boolean
  ) => {
    let newSelected: { [name: string]: boolean } = {};

    // chosse which selection to do
    if (shiftKey && ctrlKey) {
      // conflicting entries, do nothing
      return;
    } else if (shiftKey) {
      // select all 'till this one
      if (thisItem.insideFiles === undefined) {
        // for files
        newSelected = { ...selectedFiles };

        let fileList = Object.keys(selectedFiles);
        let lastSelectedIndex = fileList.indexOf(lastClickedFile);
        let justSelectedIndex = fileList.indexOf(thisItem.name);

        if (lastSelectedIndex === -1) {
          newSelected[thisItem.name] = !newSelected[thisItem.name];
          setLastClickedFile(thisItem.name);
        } else if (justSelectedIndex === -1) {
          // some serious bug ocurred
          console.error(
            "some serious bug ocurred justSelectedIndex === -1",
            thisItem.name,
            fileList
          );
        } else {
          let step = justSelectedIndex < lastSelectedIndex ? 1 : -1;
          for (
            let pos = justSelectedIndex;
            pos != lastSelectedIndex;
            pos = pos + step
          ) {
            newSelected[fileList[pos]] = true;
          }
        }

        setSelectedFiles(newSelected);
      } else {
        // for folders
        newSelected = { ...selectedFolders };

        let folderList = Object.keys(selectedFolders);
        let lastSelectedIndex = folderList.indexOf(lastClickedFolder);
        let justSelectedIndex = folderList.indexOf(thisItem.name);

        if (lastSelectedIndex === -1) {
          newSelected[thisItem.name] = !newSelected[thisItem.name];
          setLastClickedFolder(thisItem.name);
        } else if (justSelectedIndex === -1) {
          // some serious bug ocurred
          console.error(
            "some serious bug ocurred justSelectedIndex === -1",
            thisItem.name,
            folderList
          );
        } else {
          let step = justSelectedIndex < lastSelectedIndex ? 1 : -1;
          for (
            let pos = justSelectedIndex;
            pos != lastSelectedIndex;
            pos = pos + step
          ) {
            newSelected[folderList[pos]] = true;
          }
        }

        setSelectedFolders(newSelected);
      }
    } else if (ctrlKey) {
      // select this one too
      if (thisItem.insideFiles === undefined) {
        // for files
        newSelected = { ...selectedFiles };
        newSelected[thisItem.name] = !newSelected[thisItem.name];
        setSelectedFiles(newSelected);
      } else {
        // for folders
        newSelected = { ...selectedFolders };
        newSelected[thisItem.name] = !newSelected[thisItem.name];
        setSelectedFolders(newSelected);
      }
    } else {
      // select only this one
      if (thisItem.insideFiles === undefined) {
        // for files
        newSelected = { ...selectedFiles };

        for (let sel in selectedFiles) {
          newSelected[sel] = sel === thisItem.name ? isSelected : false;
        }

        setSelectedFiles(newSelected);
      } else {
        // for folders
        newSelected = { ...selectedFolders };

        for (let sel in selectedFolders) {
          newSelected[sel] = sel === thisItem.name ? isSelected : false;
        }

        setSelectedFolders(newSelected);
      }
    }

    // decide who was the last selected
    if (newSelected[thisItem.name]) {
      if (thisItem.insideFiles === undefined) {
        // for files
        setLastClickedFile(thisItem.name);
      } else {
        // for folders
        setLastClickedFolder(thisItem.name);
      }
    }
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
        {address.map((value) => (
          <Link
            color="inherit"
            // href="/"
            // onClick={() => {
            //   console.log("click");
            // }}
          >
            {value}
          </Link>
        ))}
      </Breadcrumbs>

      <div className={classes.mainContainer}>
        <Typography variant="h5" color="textPrimary">
          {capitalize(language.msgs.folders)}
        </Typography>
        {/* rendering folders */}
        <div className={classes.flexcont}>
          {Object.values(fileTree)
            .filter((value) => value.insideFiles !== undefined)
            .map((value) => (
              <Item
                folder
                name={value.name}
                itemType="item"
                stopPropagation={true}
                droppableItemType="item"
                droppedIn={(item) => {
                  // put droped item inside this folder
                  let toBeMovied: string = (item as any).name;
                  let newfileTree: FileTree = { ...fileTree };

                  if (toBeMovied === value.name) {
                    // you cant insert a file in itself
                    return;
                  } else if (newfileTree[value.name].insideFiles) {
                    // gather all selected items
                    let selected = Object.keys(selectedFiles)
                      .filter(
                        (selValue) =>
                          // get all selected but the current file
                          selectedFiles[selValue] && selValue !== value.name
                      )
                      .concat(
                        Object.keys(selectedFolders).filter(
                          (selValue) =>
                            // get all selected but the current folder
                            selectedFolders[selValue] && selValue !== value.name
                        )
                      );

                    // add the current selected item to the list if not present
                    if (selected.indexOf(toBeMovied) === -1) {
                      selected.push(toBeMovied);
                    }
                    console.log("selected", selected);

                    // inset the items in the current folder
                    for (let item of selected) {
                      (newfileTree[value.name].insideFiles as FileTree)[item] =
                        newfileTree[item];
                      delete newfileTree[item];
                    }

                    setFileTree(newfileTree);
                  } else {
                    // the folder where the file should be inserted is not a folder!
                    console.error(
                      `folder ${value.name} does not has a files object inside it, something is wrong. Operation cancelled`
                    );
                    return;
                  }
                }}
                selected={selectedFolders[value.name]}
                onClick={(selected, shiftKey, ctrlKey) => {
                  onClickItemHandler(value, selected, shiftKey, ctrlKey);
                }}
              />
            ))}
        </div>

        <Divider variant="middle" className={classes.divider} />

        <Typography variant="h5" color="textPrimary">
          {capitalize(language.msgs.files)}
        </Typography>
        <div className={classes.flexcont}>
          {/* rendering files */}
          {Object.values(fileTree)
            .filter((value) => value.insideFiles === undefined)
            .map((value) => (
              <Item
                name={value.name}
                itemType="item"
                stopPropagation={true}
                selected={selectedFiles[value.name]}
                onClick={(selected, shiftKey, ctrlKey) => {
                  onClickItemHandler(value, selected, shiftKey, ctrlKey);
                }}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default UserHome;
