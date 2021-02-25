// Third party libs
import React from "react";
import { Chip, CssBaseline, Tooltip } from "@material-ui/core";
import FolderRoundedIcon from "@material-ui/icons/FolderRounded";
import DescriptionRoundedIcon from "@material-ui/icons/DescriptionRounded";
import { DropTargetMonitor, useDrag, useDrop } from "react-dnd";
import { DragObjectWithType } from "react-dnd/dist/types/hooks/types";

// Internal imports
import { useStyles } from "./ItemStyle";
// import { LocaleContext } from "../../Reducers/Locale/LocaleContext";

type ItemProps = {
  name?: string;
  itemType: string;
  folder?: boolean;
  dragOpacity?: number;
  droppableItemType?: string;
  maxLabelLen?: number;
  cutterIndicator?: string;
  itemInfo?: any;
  droppedIn?: (item: DragObjectWithType, monitor: DropTargetMonitor) => any;
  selected?: boolean;
  onClick?: (selected: boolean, shiftKey: boolean, ctrlKey: boolean) => any;
  onDoubleClick?: () => any;
  stopPropagation?: boolean;
};

function Item({
  name = "",
  itemType = "asdasd",
  folder = false,
  dragOpacity = 0.25,
  droppableItemType = "@notDroppable@",
  maxLabelLen = 11,
  cutterIndicator = "...",
  itemInfo = undefined,
  droppedIn = () => {},
  selected = false,
  onClick = (selected: boolean, shiftKey: boolean, ctrlKey: boolean) => {},
  onDoubleClick = () => {},
  stopPropagation = false,
}: ItemProps) {
  // check params consistency
  if (maxLabelLen <= cutterIndicator.length) {
    let error = "maxLabelLen must be > cutterIndicator length";
    console.error(error);
    throw new Error(error);
  }

  const classes = useStyles();
  // const { language } = useContext(LocaleContext);

  // react-dnd States
  const [{ isDragging }, drag] = useDrag({
    item: { type: itemType, name: name, info: itemInfo },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const [{ isOver }, drop] = useDrop({
    accept: !droppableItemType ? itemType : droppableItemType,
    drop: (item, monitor) => {
      droppedIn(item, monitor);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const nameCutter = (name: string): string => {
    if (name.length > maxLabelLen) {
      return (
        name.slice(0, maxLabelLen - cutterIndicator.length) + cutterIndicator
      );
    } else {
      return name;
    }
  };

  return (
    <div
      ref={!droppableItemType ? null : drop}
      className={`${classes.dropWrapper} ${
        isOver || selected ? classes.isOver : ""
      }`}
      onClick={(event) => {
        if (stopPropagation) {
          event.stopPropagation();
        }
        onClick(!selected, event.shiftKey, event.ctrlKey);
      }}
      onDoubleClick={(event) => {
        if (stopPropagation) {
          event.stopPropagation();
        }
        console.log("double clicked");
        onDoubleClick();
      }}
    >
      <CssBaseline />
      <div ref={drag} className={classes.itemdiv}>
        {folder ? (
          <Tooltip title={name}>
            <FolderRoundedIcon
              className={classes.icon}
              opacity={isDragging ? dragOpacity.toString() : "1"}
            />
          </Tooltip>
        ) : (
          <Tooltip title={name}>
            <DescriptionRoundedIcon
              className={classes.icon}
              opacity={isDragging ? dragOpacity.toString() : "1"}
            />
          </Tooltip>
        )}
        {name ? (
          <Tooltip title={name}>
            <Chip label={nameCutter(name)} className={classes.nameLabel} />
          </Tooltip>
        ) : undefined}
      </div>
    </div>
  );
}

export default Item;
