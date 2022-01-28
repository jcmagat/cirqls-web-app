import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ADD_MEDIA_POST } from "../../graphql/mutations";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { DropzoneArea } from "material-ui-dropzone";

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

function SubmitMediaPostForm({ communityId }) {
  const classes = useStyles();
  const history = useHistory();

  const [title, setTitle] = useState("");
  const [media, setMedia] = useState();

  const [addMediaPost, { loading }] = useMutation(ADD_MEDIA_POST, {
    onCompleted: finishAddMediaPost,
  });

  const handleSetMedia = (loadedFiles) => {
    setMedia(loadedFiles[0]);
  };

  const handleAddMediaPost = () => {
    addMediaPost({
      variables: {
        title: title,
        media: media,
        community_id: communityId,
      },
    });
  };

  function finishAddMediaPost(data) {
    history.push(`/post/${data.addMediaPost.post_id}`);
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

        <DropzoneArea
          filesLimit={1}
          acceptedFiles={["image/jpeg"]}
          onChange={handleSetMedia}
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
          onClick={handleAddMediaPost}
          disabled={!communityId || !title || !media || loading}
        >
          Submit
        </Button>
      </Paper>
    </Paper>
  );
}

export default SubmitMediaPostForm;
