import { useState, useEffect } from "react";
import { useAuthUser } from "../../context/AuthUserContext";
import { useMutation, ApolloError } from "@apollo/client";
import { CHANGE_EMAIL } from "../../graphql/mutations";
import isEmail from "validator/lib/isEmail";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function ChangeEmailForm() {
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

  // Sets the new email and confirm new email error messages
  useEffect(() => {
    // Resets the new email error when the new email changes
    setNewEmailError("");

    // Checks whether confirm new email matches the new email
    if (confirmNewEmail && confirmNewEmail !== newEmail) {
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
    if (!password) {
      setPasswordError("Please confirm your password");
      return;
    } else if (!newEmail || !isEmail(newEmail)) {
      setNewEmailError("Please provide a valid email address");
      return;
    } else if (!confirmNewEmail) {
      setConfirmNewEmailError("Please confirm your new email address");
      return;
    }

    if (passwordError || newEmailError || confirmNewEmailError) return;

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
  function handleError(error: ApolloError) {
    if (error.message.includes("password")) {
      setPasswordError(error.message);
    } else if (error.message.includes("Email")) {
      setNewEmailError(error.message);
    }
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
      <Typography variant="body1">Email Address</Typography>

      {isChangeMode ? (
        <>
          <Box
            sx={{
              width: "max-content",
              marginTop: 1,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <TextField
              size="small"
              type="password"
              id="password"
              label="Password"
              autoFocus
              onChange={(event) => setPassword(event.target.value)}
              disabled={loading}
              error={Boolean(passwordError)}
              helperText={passwordError}
            />

            <TextField
              size="small"
              type="email"
              id="new-email-address"
              label="New Email Address"
              onChange={(event) => setNewEmail(event.target.value)}
              disabled={loading}
              error={Boolean(newEmailError)}
              helperText={newEmailError}
            />

            <TextField
              size="small"
              type="email"
              id="confirm-new-email-address"
              label="Confirm New Email Address"
              onChange={(event) => setConfirmNewEmail(event.target.value)}
              disabled={loading}
              error={Boolean(confirmNewEmailError)}
              helperText={confirmNewEmailError}
            />
          </Box>

          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
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
              variant="contained"
              onClick={handleChangeEmail}
              disabled={loading}
            >
              Save
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Typography variant="body2">{authUser.email}</Typography>

          <Button
            variant="outlined"
            color="primary"
            sx={{ position: "absolute", top: 0, right: 0 }}
            onClick={handleChangeButtonClick}
          >
            Change
          </Button>
        </>
      )}
    </Box>
  );
}

export default ChangeEmailForm;
