import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ADD_POST } from "../../graphql/mutations";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  buttons: {
    marginTop: 8,
    display: "flex",
    gap: 8,
    float: "right",
  },
});

function SubmitTextPostForm({ communityId }) {
  const classes = useStyles();
  const history = useHistory();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [addPost, { loading }] = useMutation(ADD_POST, {
    onCompleted: finishAddPost,
  });

  const handleAddPost = () => {
    addPost({
      variables: {
        title: title,
        description: description,
        community_id: communityId,
      },
    });
  };

  function finishAddPost(data) {
    history.push(`/post/${data.addPost.post_id}`);
  }

  const handleCancel = () => {
    history.push("/");
  };

  return (
    <Paper elevation={0}>
      <form className={classes.form} noValidate autoComplete="off">
        <TextField
          id="title"
          label="Title"
          variant="outlined"
          fullWidth
          onChange={(event) => setTitle(event.target.value)}
          disabled={loading}
        />

        <TextField
          id="description"
          label="Description"
          variant="outlined"
          multiline
          rows={8}
          fullWidth
          onChange={(event) => setDescription(event.target.value)}
          disabled={loading}
        />
      </form>

      <Paper className={classes.buttons} elevation={0}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddPost}
          disabled={!communityId || !title || !description || loading}
        >
          Submit
        </Button>
      </Paper>
    </Paper>
  );
}

export default SubmitTextPostForm;
