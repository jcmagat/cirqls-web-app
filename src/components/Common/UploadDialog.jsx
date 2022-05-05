import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { DropzoneArea } from "react-mui-dropzone";

function UploadDialog({ open, onClose, onDone, disabled }) {
  const [file, setFile] = useState(null);

  const handleClose = () => {
    onClose();
  };

  const handleDone = () => {
    onDone(file);
  };

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Upload</Typography>
          <IconButton onClick={handleClose} disabled={disabled}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <DropzoneArea
          filesLimit={1}
          acceptedFiles={["image/jpeg"]}
          onChange={(loadedFiles) => setFile(loadedFiles[0])}
          dropzoneProps={{ disabled: disabled }}
        />
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          color="error"
          onClick={handleClose}
          disabled={disabled}
        >
          Cancel
        </Button>

        <Button variant="contained" onClick={handleDone} disabled={disabled}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UploadDialog;
