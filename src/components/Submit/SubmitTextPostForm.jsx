import React, { useState } from "react";
import makeStyles from "@mui/styles/makeStyles";
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ADD_TEXT_POST } from "../../graphql/mutations";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

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

  const [addTextPost, { loading }] = useMutation(ADD_TEXT_POST, {
    onCompleted: finishAddTextPost,
  });

  const handleAddTextPost = () => {
    addTextPost({
      variables: {
        title: title,
        description: description,
        community_id: communityId,
      },
    });
  };

  function finishAddTextPost(data) {
    history.push(`/post/${data.addTextPost.post_id}`);
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
          fullWidth
          onChange={(event) => setTitle(event.target.value)}
          disabled={loading}
        />

        <TextField
          id="description"
          label="Description"
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
          onClick={handleAddTextPost}
          disabled={!communityId || !title || !description || loading}
        >
          Submit
        </Button>
      </Paper>
    </Paper>
  );
}

export default SubmitTextPostForm;
