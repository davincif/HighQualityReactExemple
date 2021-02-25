// Third party libs
import React from "react";
import { CssBaseline } from "@material-ui/core";
import FolderRoundedIcon from "@material-ui/icons/FolderRounded";
import DescriptionRoundedIcon from "@material-ui/icons/DescriptionRounded";
import { useDrag, useDrop } from "react-dnd";

// Internal imports
import { useStyles } from "./ItemStyle";
// import { LocaleContext } from "../../Reducers/Locale/LocaleContext";

type ItemProps = {
  itemType: string;
  folder?: boolean;
  dragOpacity?: number;
  droppableItemType?: string;
};

function Item(props: ItemProps) {
  // preparing props
  props = {
    ...props,
    dragOpacity: !props.dragOpacity ? props.dragOpacity : 0.5,
    droppableItemType: !props.droppableItemType
      ? "@useless@"
      : props.droppableItemType,
  };

  const classes = useStyles();
  // const { language } = useContext(LocaleContext);
  const [{ isDragging }, drag] = useDrag({
    item: { type: props.itemType },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const [{ isOver }, drop] = useDrop({
    accept: !props.droppableItemType ? props.itemType : props.droppableItemType,
    drop: (item, monitor) => {
      console.log("item", item);
      console.log("monitor", monitor);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={!props.droppableItemType ? null : drop}
      className={classes.dropWrapper + " " + `${isOver ? classes.isOver : ""}`}
    >
      <div ref={drag} className={classes.itemdiv}>
        <CssBaseline />
        {props.folder ? (
          <FolderRoundedIcon
            className={classes.icon}
            opacity={isDragging ? props?.dragOpacity?.toString() : "1"}
          />
        ) : (
          <DescriptionRoundedIcon
            className={classes.icon}
            opacity={isDragging ? props?.dragOpacity?.toString() : "1"}
          />
        )}
      </div>
    </div>
  );
}

export default Item;
