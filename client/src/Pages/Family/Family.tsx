// Third party libs
import React, { useContext, useState } from "react";
import {
  Avatar,
  Backdrop,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  TextField,
  CssBaseline,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { Autocomplete } from "@material-ui/lab";

// Internal imports
import { useStyles } from "./FamileStyle";
import { LocaleContext } from "../../Reducers/Locale/LocaleContext";
import { capitalize, capitalizeInitials } from "../../Reducers/Locale/Tools";
import Navbar from "../../Components/Navbar/Navbar";

function Family(props?: {}) {
  const classes = useStyles();
  const { language } = useContext(LocaleContext);
  const mockPeople = [
    {
      name: "Estronildo Bezerra",
      nick: "Estronildo",
    },
    {
      name: "Drahoslav Voinea",
      nick: "Drahoslav",
    },
    {
      name: "Ciprian Martinescu",
      nick: "Ciprian",
    },
    {
      name: "Iulien Mihaili",
      nick: "Iulien",
    },
    {
      name: "Sergiu Moldovan",
      nick: "Sergiu",
    },
    {
      name: "Octavian Antonescu",
      nick: "Octavian",
    },
    {
      name: "Nic Iordanescu",
      nick: "Nic",
    },
    {
      name: "Dorin Macedonski",
      nick: "Dorin",
    },
    {
      name: "Denis Corbeanu",
      nick: "Denis",
    },
    {
      name: "Marin Ene",
      nick: "Marin",
    },
    {
      name: "Dragomir Zamfir",
      nick: "Dragomir",
    },
  ];
  const [people, setPeople] = useState(mockPeople);
  const [open, setOpen] = React.useState(false);
  const [selperson, setSelperson] = React.useState({ name: "", nick: "" });
  const [showSel, setShowSel] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    if (showSel) {
      setShowSel(false);
      setSelperson({ name: "", nick: "" });
    }
  };

  const avatar = ({ name, nick }: { name: string; nick: string }) => {
    return (
      <div className={classes.avatarWrapper}>
        <Avatar className={classes.avatar}>{nick[0]}</Avatar>
        <Chip label={name} className={classes.avatarName} />
      </div>
    );
  };

  return (
    <div>
      <Navbar />
      <Container fixed className={classes.mainContainer}>
        <CssBaseline />
        {people.map((person) => avatar(person))}
        <div className={classes.avatarWrapper} onClick={handleOpen}>
          <Fab
            color="primary"
            aria-label="add"
            className={classes.avatar + " " + classes.add}
            onClick={handleOpen}
          >
            <AddIcon className={classes.plusIcon} />
          </Fab>
        </div>
      </Container>
      <Dialog
        aria-labelledby="transition-dialog-title"
        aria-describedby="transition-dialog-description"
        onClose={handleClose}
        open={open}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <DialogTitle id="simple-dialog-title">
          {capitalizeInitials(language.msgs.add_family_member)}
        </DialogTitle>
        <DialogContent>
          <Autocomplete
            // id="combo-box-demo"
            options={mockPeople}
            getOptionLabel={(option: any) => option.nick}
            blurOnSelect={true}
            style={{ width: 300 }}
            renderInput={(params: any) => (
              <TextField
                {...params}
                label={language.msgs.nick}
                variant="outlined"
              />
            )}
            onChange={(event: any, newValue) => {
              if (newValue) {
                setSelperson(newValue);
              } else {
                setShowSel(false);
                setSelperson({ name: "", nick: "" });
              }
            }}
            onInputChange={(event, newInputValue) => {
              setShowSel(true);
            }}
          />
          <div hidden={!showSel}>{avatar(selperson)}</div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {capitalize(language.msgs.cancel)}
          </Button>
          <Button onClick={() => {}} color="primary">
            {capitalize(language.msgs.add)}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Family;
