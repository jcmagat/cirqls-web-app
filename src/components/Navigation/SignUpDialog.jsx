import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { useMutation } from "@apollo/client";
import { SIGNUP } from "../../graphql/mutations";
import isEmail from "validator/lib/isEmail";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Alert from "@material-ui/lab/Alert";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const useStyles = makeStyles({
  title: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

function SignUpDialog({ open, onClose }) {
  const classes = useStyles();

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
    <Paper elevation={0}>
      <Dialog open={open}>
        <DialogTitle>
          <Paper className={classes.title} elevation={0}>
            <Typography variant="h6">Sign Up</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Paper>
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
              variant="outlined"
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
    </Paper>
  );
}

export default SignUpDialog;
