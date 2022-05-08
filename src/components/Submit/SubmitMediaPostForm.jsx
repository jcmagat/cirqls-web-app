import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ADD_MEDIA_POST } from "../../graphql/mutations";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { DropzoneArea } from "react-mui-dropzone";

const StyledDropzoneAreaBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "error",
})(({ theme, error }) => ({
  color: error ? theme.palette.error.main : "inherit",
  "& .MuiDropzoneArea-root": {
    borderColor: error ? theme.palette.error.light : "rgba(0, 0, 0, 0.2)",
  },
  "& .MuiDropzoneArea-icon": {
    color: "inherit",
  },
  "& .MuiTypography-caption": {
    display: error ? "block" : "none",
    marginLeft: 16,
    marginTop: 4,
  },
}));

function SubmitMediaPostForm({ communityId, onCommunityIdError }) {
  const history = useHistory();

  const [title, setTitle] = useState("");
  const [media, setMedia] = useState();

  const [titleError, setTitleError] = useState("");
  const [mediaError, setMediaError] = useState("");

  const [addMediaPost, { loading }] = useMutation(ADD_MEDIA_POST, {
    onCompleted: (data) => history.push(`/post/${data.addMediaPost.post_id}`),
  });

  const handleAddMediaPost = () => {
    if (!communityId) {
      onCommunityIdError();
      return;
    } else if (!title) {
      setTitleError("Please provide a title");
      return;
    } else if (!media) {
      setMediaError("Please provide media");
      return;
    }

    addMediaPost({
      variables: {
        title: title,
        media: media,
        community_id: communityId,
      },
    });
  };

  const handleChangeTitle = (event) => {
    setTitle(event.target.value);
    setTitleError("");
  };

  const handleChangeMedia = (loadedFiles) => {
    setMedia(loadedFiles[0]);
    setMediaError("");
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

      <StyledDropzoneAreaBox error={Boolean(mediaError)}>
        <DropzoneArea
          Icon={CloudUploadOutlinedIcon}
          dropzoneText="Click to choose a file, or drag and drop it here"
          filesLimit={1}
          acceptedFiles={["image/*"]}
          onChange={handleChangeMedia}
          dropzoneProps={{ disabled: loading }}
        />
        <Typography variant="caption">{mediaError}</Typography>
      </StyledDropzoneAreaBox>

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
          onClick={handleAddMediaPost}
          disabled={loading}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
}

export default SubmitMediaPostForm;
