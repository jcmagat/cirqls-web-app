import React, { useState, useEffect } from "react";
import makeStyles from "@mui/styles/makeStyles";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const useStyles = makeStyles((theme) => ({
  buttons: {
    marginTop: 8,
    float: "right",
  },
  cancelButton: {
    marginRight: 8,
  },
}));

function CommentForm(props) {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (props.onSubmit) {
      props.onSubmit(message);
    }

    setMessage("");
  };

  const handleCancel = () => {
    setMessage("");

    if (props.onCancel) {
      props.onCancel();
    }
  };

  return (
    <Paper elevation={0}>
      {open && (
        <Paper elevation={0}>
          <form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Paper elevation={0}>
              <TextField
                id="comment"
                label="Comment"
                value={message}
                multiline
                rows={8}
                fullWidth
                autoFocus={props.autoFocus}
                onChange={(event) => setMessage(event.target.value)}
                // disabled={loading}
              />
            </Paper>

            <Paper className={classes.buttons} elevation={0}>
              {props.showCancelButton && (
                <Button
                  className={classes.cancelButton}
                  variant="outlined"
                  color="secondary"
                  onClick={handleCancel}
                  // disabled={loading}
                >
                  Cancel
                </Button>
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!message}
              >
                Submit
              </Button>
            </Paper>
          </form>
        </Paper>
      )}
    </Paper>
  );
}

export default CommentForm;
