import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import NavBar from "../components/NavBar";
import { useQuery, useMutation } from "@apollo/client";
import { GET_COMMUNITIES } from "../graphql/queries";
import { ADD_POST } from "../graphql/mutations";

const useStyles = makeStyles({
  paper: {
    marginTop: 80,
  },
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

function SubmitPage(props) {
  const classes = useStyles();
  const history = useHistory();

  const [communities, setCommunities] = useState([]);

  const { data } = useQuery(GET_COMMUNITIES);

  useEffect(() => {
    if (data) {
      setCommunities(data.communities);
    }
  }, [data]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [communityId, setCommunityId] = useState();

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
    <Container component="main" maxWidth="md">
      <NavBar />

      <Paper className={classes.paper} elevation={0}>
        <form className={classes.form} noValidate autoComplete="off">
          <TextField
            select
            id="community"
            label="Community"
            variant="outlined"
            onChange={(event) => setCommunityId(parseInt(event.target.value))}
            disabled={loading}
          >
            <MenuItem value="" disabled>
              Community
            </MenuItem>
            {communities.map((community) => (
              <MenuItem
                key={community.community_id}
                value={community.community_id}
              >
                {community.name}
              </MenuItem>
            ))}
          </TextField>

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
    </Container>
  );
}

export default SubmitPage;
