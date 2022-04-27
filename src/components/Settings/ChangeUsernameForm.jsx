import React, { useState, useEffect } from "react";
import makeStyles from "@mui/styles/makeStyles";
import { useAuthUser } from "../../context/AuthUserContext";
import { useMutation } from "@apollo/client";
import { CHANGE_USERNAME } from "../../graphql/mutations";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "space-between",
  },
  buttonPaper: {
    display: "flex",
    alignItems: "center",
    marginRight: 16,
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
  },
  form: {
    marginTop: 8,
  },
});

function ChangeUsernameForm(props) {
  const classes = useStyles();

  const authUser = useAuthUser();

  const [isChangeMode, setIsChangeMode] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newUsernameError, setNewUsernameError] = useState("");

  // Resets the error message when the new username changes
  useEffect(() => {
    setNewUsernameError("");
  }, [newUsername]);

  useEffect(() => {
    if (!authUser) return;

    setNewUsername(authUser.username);
  }, [authUser]);

  const [changeUsername, { loading }] = useMutation(CHANGE_USERNAME, {
    onCompleted: finishChangeUsername,
    onError: handleError,
  });

  // Called when the save button is clicked
  const handleChangeUsername = () => {
    if (newUsername === authUser.username) {
      setIsChangeMode(false);
      return;
    }

    changeUsername({
      variables: {
        username: newUsername,
      },
    });
  };

  // Called when the change button is clicked
  const handleChangeButtonClick = () => {
    setIsChangeMode(true);
  };

  // Called when the cancel button is clicked
  const handleCancel = () => {
    setNewUsername(authUser.username);
    setNewUsernameError("");
    setIsChangeMode(false);
  };

  // Called after the mutation is completed
  function finishChangeUsername() {
    setIsChangeMode(false);
  }

  // Called when the mutation returns an error
  function handleError(error) {
    setNewUsernameError(error.message);
  }

  return (
    <Paper className={classes.root} elevation={0}>
      <Paper elevation={0}>
        <Typography variant="body1">Username</Typography>
        {isChangeMode ? (
          <TextField
            className={classes.form}
            size="small"
            id="username"
            label="Username"
            autoFocus
            value={newUsername}
            onChange={(event) => setNewUsername(event.target.value)}
            disabled={loading}
            error={Boolean(newUsernameError)}
            helperText={newUsernameError}
          />
        ) : (
          <Typography variant="body2">{`u/${authUser.username}`}</Typography>
        )}
      </Paper>

      <Paper className={classes.buttonPaper} elevation={0}>
        {isChangeMode ? (
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
              variant="outlined"
              color="primary"
              onClick={handleChangeUsername}
              disabled={!newUsername || Boolean(newUsernameError) || loading}
            >
              Save
            </Button>
          </Paper>
        ) : (
          <Button
            variant="outlined"
            color="primary"
            onClick={handleChangeButtonClick}
          >
            Change
          </Button>
        )}
      </Paper>
    </Paper>
  );
}

export default ChangeUsernameForm;
