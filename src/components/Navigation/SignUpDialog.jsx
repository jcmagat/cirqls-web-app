import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

function SignUpDialog({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleEmailChange = (email) => {
    setEmail(email);
    setEmailError("");
  };

  const handleSignUp = () => {
    console.log(email);
  };

  return (
    <div>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Sign Up</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To sign up for a Cirqls account, you must verify your email address
          </DialogContentText>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            type="email"
            id="email"
            label="Email"
            autoFocus
            onChange={(event) => handleEmailChange(event.target.value)}
            // disabled={loading}
            error={Boolean(emailError)}
            helperText={emailError}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSignUp}
            // disabled={loading}
          >
            Sign Up
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default SignUpDialog;
