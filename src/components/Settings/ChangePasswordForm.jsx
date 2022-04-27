import React, { useState, useEffect } from "react";
import makeStyles from "@mui/styles/makeStyles";
import { useMutation } from "@apollo/client";
import { CHANGE_PASSWORD } from "../../graphql/mutations";
import isStrongPassword from "validator/lib/isStrongPassword";
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
    display: "flex",
    flexDirection: "row",
    gap: 32,
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
  const [newPasswordError, setNewPasswordError] = useState("");

  const [confirmNewPassword, setConfirmNewPassord] = useState("");
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState("");

  // Resets the current password error when the current password changes
  useEffect(() => {
    setCurrentPasswordError("");
  }, [currentPassword]);

  useEffect(() => {
    // Checks whether the new password is strong enough
    if (newPassword && !isStrongPassword(newPassword, { minSymbols: 0 })) {
      setNewPasswordError("Password not strong enough");
    } else {
      setNewPasswordError("");
    }

    // Checks whether confirm new password matches the new password
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
    setNewPasswordError("");

    setConfirmNewPassord("");
    setConfirmNewPasswordError("");

    setIsChangeMode(false);
  };

  // Called after the mutation is completed
  function finishChangePassword() {
    setCurrentPassword("");
    setNewPassord("");
    setConfirmNewPassord("");
    setIsChangeMode(false);
  }

  // Called when the mutation returns an error
  function handleError(error) {
    setCurrentPasswordError(error.message);
  }

  return (
    <Paper className={classes.root} elevation={0}>
      <Paper elevation={0}>
        <Typography variant="body1">Password</Typography>
        {isChangeMode ? (
          <Paper className={classes.form} elevation={0}>
            <Paper className={classes.textfields} elevation={0}>
              <TextField
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
                size="small"
                type="password"
                id="new-password"
                label="New Password"
                required
                onChange={(event) => setNewPassord(event.target.value)}
                disabled={loading}
                error={Boolean(newPasswordError)}
                helperText={newPasswordError}
              />
              <TextField
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

            <Paper elevation={0}>
              <Typography variant="body2">
                Password must contain:
                <li>Minimum 8 characters</li>
                <li>At least 1 uppercase</li>
                <li>At least 1 lowercase</li>
                <li>At least 1 number</li>
              </Typography>
            </Paper>
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
                Boolean(currentPasswordError) ||
                !newPassword ||
                Boolean(newPasswordError) ||
                !confirmNewPassword ||
                Boolean(confirmNewPasswordError) ||
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
