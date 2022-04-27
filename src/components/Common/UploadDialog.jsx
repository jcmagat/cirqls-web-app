import React from "react";
import makeStyles from '@mui/styles/makeStyles';
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { DropzoneArea } from "material-ui-dropzone";

const useStyles = makeStyles({
  title: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

function UploadDialog({ open, onClose, onChange }) {
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
            <Typography variant="h6">Upload</Typography>
            <IconButton onClick={handleClose} size="large">
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

export default UploadDialog;
