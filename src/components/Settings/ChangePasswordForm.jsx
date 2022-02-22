import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { useMutation } from "@apollo/client";
import { CHANGE_PASSWORD } from "../../graphql/mutations";
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

function ChangePasswordForm(props) {
  const classes = useStyles();

  const [isChangeMode, setIsChangeMode] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");

  const [newPassword, setNewPassord] = useState("");

  const [confirmNewPassword, setConfirmNewPassord] = useState("");
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState("");

  useEffect(() => {
    setCurrentPasswordError("");
  }, [currentPassword]);

  useEffect(() => {
    if (confirmNewPassword && newPassword !== confirmNewPassword) {
      setConfirmNewPasswordError("Passwords do not match");
    } else {
      setConfirmNewPasswordError("");
    }
  }, [newPassword, confirmNewPassword]);

  const [changePassword, { loading }] = useMutation(CHANGE_PASSWORD, {
    onCompleted: finishChangePassword,
    onError: handleError,
  });

  // Called when the save button is clicked
  const handleChangePassword = () => {
    changePassword({
      variables: {
        current_password: currentPassword,
        new_password: newPassword,
      },
    });
  };

  // Called when the change button is clicked
  const handleChangeButtonClick = () => {
    setIsChangeMode(true);
  };

  // Called when the cancel button is clicked
  const handleCancel = () => {
    setCurrentPassword("");
    setCurrentPasswordError("");

    setNewPassord("");

    setConfirmNewPassord("");
    setConfirmNewPasswordError("");

    setIsChangeMode(false);
  };

  // Called after the change password mutation completes
  function finishChangePassword() {
    setCurrentPassword("");
    setNewPassord("");
    setConfirmNewPassord("");
    setIsChangeMode(false);
  }

  // Called when the change password mutation returns an error
  function handleError(error) {
    setCurrentPasswordError(error.message);
  }

  return (
    <Paper className={classes.root} elevation={0}>
      <Paper elevation={0}>
        <Typography variant="body1">Password</Typography>
        {isChangeMode ? (
          <Paper className={classes.textfields} elevation={0}>
            <TextField
              variant="outlined"
              size="small"
              type="password"
              id="current-password"
              label="Current Password"
              required
              autoFocus
              onChange={(event) => setCurrentPassword(event.target.value)}
              disabled={loading}
              error={Boolean(currentPasswordError)}
              helperText={currentPasswordError}
            />
            <TextField
              variant="outlined"
              size="small"
              type="password"
              id="new-password"
              label="New Password"
              required
              onChange={(event) => setNewPassord(event.target.value)}
              disabled={loading}
            />
            <TextField
              variant="outlined"
              size="small"
              type="password"
              id="confirm-new-password"
              label="Confirm New Password"
              required
              onChange={(event) => setConfirmNewPassord(event.target.value)}
              disabled={loading}
              error={Boolean(confirmNewPasswordError)}
              helperText={confirmNewPasswordError}
            />
          </Paper>
        ) : (
          <Typography variant="body2">********</Typography>
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
              onClick={handleChangePassword}
              disabled={
                !currentPassword ||
                currentPasswordError ||
                !newPassword ||
                !confirmNewPassword ||
                confirmNewPasswordError ||
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

export default ChangePasswordForm;
