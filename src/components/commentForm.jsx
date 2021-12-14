import React, { useState } from "react";
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
}));

function CommentForm(props) {
  const classes = useStyles();

  const [message, setMessage] = useState("");

  const [addComment] = useMutation(ADD_COMMENT, {
    onCompleted: props.handleAddComment,
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

  return (
    <Paper elevation={0}>
      <Paper elevation={0}>
        <form noValidate autoComplete="off">
          <TextField
            id="comment"
            label="Comment"
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
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddComment}
          // disabled={loading}
        >
          Comment
        </Button>
      </Paper>
    </Paper>
  );
}

export default CommentForm;
