import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useMutation } from "@apollo/client";
import { ADD_COMMENT } from "../graphql/mutations";

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
  // Maybe have onClose and onSubmit

  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  const [addComment] = useMutation(ADD_COMMENT, {
    onCompleted: finishAddComment,
  });

  const handleAddComment = () => {
    addComment({
      variables: {
        parent_comment_id: props.parent_comment_id,
        post_id: props.post_id,
        message: message,
      },
    });
  };

  function finishAddComment(data) {
    setMessage("");

    if (props.onSubmit) {
      props.onSubmit();
    }
    props.finishAddComment(data);
  }

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
          <Paper elevation={0}>
            <form noValidate autoComplete="off">
              <TextField
                id="comment"
                label="Comment"
                value={message}
                variant="outlined"
                multiline
                rows={8}
                fullWidth
                onChange={(event) => setMessage(event.target.value)}
                // disabled={loading}
              />
            </form>
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
              variant="contained"
              color="primary"
              onClick={handleAddComment}
              disabled={!message}
            >
              Comment
            </Button>
          </Paper>
        </Paper>
      )}
    </Paper>
  );
}

export default CommentForm;
