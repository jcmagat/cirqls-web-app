import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { useAuthUser } from "../../context/AuthUserContext";
import { useMutation } from "@apollo/client";
import { CHANGE_EMAIL } from "../../graphql/mutations";
import isEmail from "validator/lib/isEmail";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

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
  textfields: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginTop: 8,
  },
});

function ChangeEmailForm(props) {
  const classes = useStyles();

  const authUser = useAuthUser();

  const [isChangeMode, setIsChangeMode] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [newEmail, setNewEmail] = useState("");
  const [newEmailError, setNewEmailError] = useState("");

  const [confirmNewEmail, setConfirmNewEmail] = useState("");
  const [confirmNewEmailError, setConfirmNewEmailError] = useState("");

  // Resets the password error when the password changes
  useEffect(() => {
    setPasswordError("");
  }, [password]);

  useEffect(() => {
    // Resets the new email error when the new email changes
    setNewEmailError("");

    // Checks whether confirm new email matches the new email
    if (confirmNewEmail && newEmail !== confirmNewEmail) {
      setConfirmNewEmailError("Email addresses do not match");
    } else {
      setConfirmNewEmailError("");
    }
  }, [newEmail, confirmNewEmail]);

  const [changeEmail, { loading }] = useMutation(CHANGE_EMAIL, {
    onCompleted: finishChangeEmail,
    onError: handleError,
  });

  // Called when the save button is clicked
  const handleChangeEmail = () => {
    if (!newEmail || !isEmail(newEmail)) {
      setNewEmailError("Email address not valid");
      return;
    }

    changeEmail({
      variables: {
        password: password,
        new_email: newEmail,
      },
    });
  };

  // Called when the change button is clicked
  const handleChangeButtonClick = () => {
    setIsChangeMode(true);
  };

  // Called when the cancel button is clicked
  const handleCancel = () => {
    setPassword("");
    setPasswordError("");

    setNewEmail("");
    setNewEmailError("");

    setConfirmNewEmail("");
    setConfirmNewEmailError("");

    setIsChangeMode(false);
  };

  // Called after the mutation is completed
  function finishChangeEmail() {
    setPassword("");
    setNewEmail("");
    setConfirmNewEmail("");
    setIsChangeMode(false);
  }

  // Called when the mutation returns an error
  function handleError(error) {
    if (error.message.includes("password")) {
      setPasswordError(error.message);
    } else if (error.message.includes("Email")) {
      setNewEmailError(error.message);
    }
  }

  return (
    <Paper className={classes.root} elevation={0}>
      {isChangeMode ? (
        <Paper className={classes.textfields} elevation={0}>
          <TextField
            variant="outlined"
            size="small"
            type="password"
            id="password"
            label="Password"
            required
            autoFocus
            onChange={(event) => setPassword(event.target.value)}
            disabled={loading}
            error={Boolean(passwordError)}
            helperText={passwordError}
          />
          <TextField
            variant="outlined"
            size="small"
            type="email"
            id="new-email-address"
            label="New Email Address"
            required
            onChange={(event) => setNewEmail(event.target.value)}
            disabled={loading}
            error={Boolean(newEmailError)}
            helperText={newEmailError}
          />
          <TextField
            variant="outlined"
            size="small"
            type="email"
            id="confirm-new-email-address"
            label="Confirm New Email Address"
            required
            onChange={(event) => setConfirmNewEmail(event.target.value)}
            disabled={loading}
            error={Boolean(confirmNewEmailError)}
            helperText={confirmNewEmailError}
          />
        </Paper>
      ) : (
        <Paper elevation={0}>
          <Typography variant="body1">Email Address</Typography>
          <Typography variant="body2">{authUser.email}</Typography>
        </Paper>
      )}

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
              onClick={handleChangeEmail}
              disabled={
                !password ||
                Boolean(passwordError) ||
                !newEmail ||
                Boolean(newEmailError) ||
                !confirmNewEmail ||
                Boolean(confirmNewEmailError) ||
                loading
              }
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

export default ChangeEmailForm;
