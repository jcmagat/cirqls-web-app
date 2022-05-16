import { useState, useEffect } from "react";
import { useMutation, ApolloError } from "@apollo/client";
import { CHANGE_PASSWORD } from "../../graphql/mutations";
import isStrongPassword from "validator/lib/isStrongPassword";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import StyledButtonBox from "./StyledButtonBox";

function ChangePasswordForm() {
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
    if (currentPasswordError || newPasswordError || confirmNewPasswordError)
      return;

    if (!currentPassword) {
      setCurrentPasswordError("Please confirm your current password");
      return;
    } else if (!newPassword) {
      setNewPasswordError("Please provide a new password");
      return;
    } else if (!confirmNewPassword) {
      setConfirmNewPasswordError("Please confirm your new password");
      return;
    }

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
  function handleError(error: ApolloError) {
    setCurrentPasswordError(error.message);
  }

  return (
    <Box
      sx={{
        position: "relative",
        marginRight: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="body1">Password</Typography>

      {isChangeMode ? (
        <>
          <Box
            sx={{
              marginTop: 1,
              display: "flex",
              flexDirection: "row",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 300,
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <TextField
                size="small"
                type="password"
                id="current-password"
                label="Current Password"
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
                onChange={(event) => setConfirmNewPassord(event.target.value)}
                disabled={loading}
                error={Boolean(confirmNewPasswordError)}
                helperText={confirmNewPasswordError}
              />
            </Box>

            <Typography variant="body2">
              Password must contain at least:
              <li>8 characters</li>
              <li>1 lower case letter</li>
              <li>1 upper case letter</li>
              <li>1 number</li>
            </Typography>
          </Box>

          <StyledButtonBox
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
            }}
          >
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
              disabled={loading}
            >
              Save
            </Button>
          </StyledButtonBox>
        </>
      ) : (
        <>
          <Typography variant="body2">********</Typography>

          <StyledButtonBox>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleChangeButtonClick}
            >
              Change
            </Button>
          </StyledButtonBox>
        </>
      )}
    </Box>
  );
}

export default ChangePasswordForm;
