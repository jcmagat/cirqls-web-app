import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ADD_TEXT_POST } from "../../graphql/mutations";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function SubmitTextPostForm({ communityId }) {
  const history = useHistory();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  const [addTextPost, { loading }] = useMutation(ADD_TEXT_POST, {
    onCompleted: (data) => history.push(`/post/${data.addTextPost.post_id}`),
  });

  const handleAddTextPost = () => {
    if (!title) {
      setTitleError("Please provide a title");
      return;
    } else if (!description) {
      setDescriptionError("Please provide a description");
      return;
    }

    addTextPost({
      variables: {
        title: title,
        description: description,
        community_id: communityId,
      },
    });
  };

  const handleChangeTitle = (event) => {
    setTitle(event.target.value);
    setTitleError("");
  };

  const handleChangeDescription = (event) => {
    setDescription(event.target.value);
    setDescriptionError("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <TextField
        id="title"
        label="Title"
        fullWidth
        error={Boolean(titleError)}
        helperText={titleError}
        onChange={handleChangeTitle}
        disabled={loading}
      />

      <TextField
        id="description"
        label="Description"
        fullWidth
        multiline
        rows={8}
        error={Boolean(descriptionError)}
        helperText={descriptionError}
        onChange={handleChangeDescription}
        disabled={loading}
      />

      <Box
        sx={{
          alignSelf: "flex-end",
          display: "flex",
          flexDirection: "row",
          gap: 1,
        }}
      >
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => history.push("/")}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={handleAddTextPost}
          disabled={loading}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
}

export default SubmitTextPostForm;
