import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function CommentForm({
  open,
  onSubmit,
  onCancel,
  autoFocus,
  showCancelButton,
  sx,
}) {
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState("");

  const handleChangeMessage = (event) => {
    setMessage(event.target.value);
    setMessageError("");
  };

  const handleSubmit = () => {
    if (!message) {
      setMessageError("Please leave a comment");
      return;
    }

    if (onSubmit) {
      onSubmit(message);
    }

    setMessage("");
  };

  const handleCancel = () => {
    setMessage("");

    if (onCancel) {
      onCancel();
    }
  };

  return (
    <>
      {open && (
        <Box sx={{ ...sx }}>
          <TextField
            id="comment"
            label="Comment"
            value={message}
            multiline
            rows={8}
            fullWidth
            autoFocus={autoFocus}
            error={Boolean(messageError)}
            helperText={messageError}
            onChange={handleChangeMessage}
          />

          <Box
            sx={{
              marginTop: 1,
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              gap: 1,
            }}
          >
            {showCancelButton && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            )}

            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
}

export default CommentForm;
