import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { SIGNUP } from "../../graphql/mutations";
import isEmail from "validator/lib/isEmail";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import getGoogleOAuthURL from "../../utils/oauth";

function SignUpDialog({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setEmailError("");
  }, [email]);

  const [signUp, { loading }] = useMutation(SIGNUP, {
    onCompleted: finishSignUp,
    onError: handleError,
  });

  const handleSignUp = (event) => {
    event.preventDefault();

    if (!email || !isEmail(email)) {
      setEmailError("Email address not valid");
      return;
    }

    signUp({
      variables: {
        email: email,
      },
    });
  };

  const handleClose = () => {
    setEmail("");
    setEmailError("");
    setIsCompleted(false);

    onClose();
  };

  function finishSignUp() {
    setIsCompleted(true);

    setTimeout(() => {
      handleClose();
    }, 5000);
  }

  function handleError(error) {
    setEmailError(error.message);
  }

  return (
    <Dialog open={open}>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Sign Up</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          To sign up for a Cirqls account, you must verify your email address
        </DialogContentText>
        {isCompleted && (
          <Alert severity="success">
            {`A verification email has been sent to ${email}`}
          </Alert>
        )}
        <form noValidate onSubmit={handleSignUp}>
          <TextField
            margin="normal"
            type="email"
            id="email"
            label="Email"
            required
            fullWidth
            autoFocus
            onChange={(event) => setEmail(event.target.value)}
            disabled={loading || isCompleted}
            error={Boolean(emailError)}
            helperText={emailError}
          />
        </form>
        <Button variant="outlined" href={getGoogleOAuthURL()}>
          Sign up with Google
        </Button>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSignUp}
          disabled={loading || isCompleted}
        >
          Sign Up
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SignUpDialog;
