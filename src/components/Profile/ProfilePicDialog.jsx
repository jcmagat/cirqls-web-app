import React from "react";
import { makeStyles } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { DropzoneArea } from "material-ui-dropzone";

const useStyles = makeStyles({
  title: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

function ProfilePicDialog({ open, onClose, onChange }) {
  const classes = useStyles();

  const handleClose = () => {
    onClose();
  };

  const handleChange = (loadedFiles) => {
    onChange(loadedFiles[0]);
  };

  return (
    <Paper elevation={0}>
      <Dialog open={open}>
        <DialogTitle>
          <Paper className={classes.title} elevation={0}>
            <Typography variant="h6">Upload Profile Picture</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Paper>
        </DialogTitle>

        <DialogContent>
          <DropzoneArea
            filesLimit={1}
            acceptedFiles={["image/jpeg"]}
            onChange={handleChange}
          />
        </DialogContent>

        <DialogActions>
          <Button variant="contained" color="primary" onClick={handleClose}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default ProfilePicDialog;
