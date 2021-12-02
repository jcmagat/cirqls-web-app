import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import NavBar from "./navBar";
import { useMutation } from "@apollo/client";
import { ADD_POST } from "../graphql/mutations";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  buttons: {
    marginTop: 8,
    float: "right",
  },
  cancelButton: {
    marginRight: 8,
  },
}));

function SubmitPage(props) {
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
      },
    });
  };

  function finishAddPost(data) {
    history.push("/");
  }

  const handleCancel = () => {
    history.push("/");
  };

  return (
    <Paper elevation={0}>
      <NavBar />
      <Container component="main" maxWidth="md">
        <Paper className={classes.paper} elevation={0}>
          <form className={classes.form} noValidate autoComplete="off">
            <TextField
              id="title"
              label="Title"
              variant="outlined"
              margin="normal"
              autoFocus
              fullWidth
              onChange={(event) => setTitle(event.target.value)}
              disabled={loading}
            />
            <TextField
              id="description"
              label="Description"
              variant="outlined"
              multiline
              rows={6}
              fullWidth
              onChange={(event) => setDescription(event.target.value)}
              disabled={loading}
            />
          </form>
        </Paper>

        <Paper className={classes.buttons} elevation={0}>
          <Button
            className={classes.cancelButton}
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
            disabled={loading}
          >
            Submit
          </Button>
        </Paper>
      </Container>
    </Paper>
  );
}

export default SubmitPage;