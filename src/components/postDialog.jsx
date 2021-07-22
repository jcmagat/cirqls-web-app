import React from "react";
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
  fab: {
    position: "fixed",
    right: 20,
    bottom: 20,
  },
  pos: {
    marginBottom: 20,
  },
});

function PostDialog(props) {
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setName("");
    setMessage("");

    setOpen(false);
  };

  const handlePost = () => {
    const data = {
      name: name,
      message: message,
    };
    props.addPost(data);

    handleClose();
  };

  const handleNameChange = (name) => {
    setName(name);
  };

  const handleMessageChange = (message) => {
    setMessage(message);
  };

  return (
    <div>
      <Fab
        className={classes.fab}
        color="primary"
        aria-label="add"
        onClick={handleOpen}
      >
        <AddIcon />
      </Fab>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <form noValidate autoComplete="off">
            <TextField
              className={classes.pos}
              id="name"
              label="Name"
              autoFocus
              fullWidth
              onChange={(event) => handleNameChange(event.target.value)}
            />
            <TextField
              className={classes.pos}
              id="message"
              label="Message"
              variant="filled"
              multiline
              rows={6}
              fullWidth
              onChange={(event) => handleMessageChange(event.target.value)}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handlePost} variant="contained" color="primary">
            Post
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PostDialog;
