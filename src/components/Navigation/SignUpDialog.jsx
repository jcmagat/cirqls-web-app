import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { SIGNUP } from "../../graphql/mutations";
import isEmail from "validator/lib/isEmail";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import GoogleOAuthButton from "../Common/GoogleOAuthButton";

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
      setEmailError("Please provide a valid email address");
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
    <Dialog open={open} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingRight: 1,
        }}
      >
        <Typography variant="h6">Sign up</Typography>

        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center" }}>
        <GoogleOAuthButton label="Sign up with Google" />

        <Typography sx={{ marginTop: 2, marginBottom: 2 }}>OR</Typography>

        {isCompleted && (
          <Alert severity="success">
            {`A verification email has been sent to ${email}`}
          </Alert>
        )}
        <form noValidate onSubmit={handleSignUp}>
          <TextField
            type="email"
            id="email"
            label="Email Address"
            fullWidth
            onChange={(event) => setEmail(event.target.value)}
            disabled={loading || isCompleted}
            error={Boolean(emailError)}
            helperText={emailError}
          />
        </form>
      </DialogContent>

      <DialogActions sx={{ paddingBottom: 3, paddingRight: 3 }}>
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
