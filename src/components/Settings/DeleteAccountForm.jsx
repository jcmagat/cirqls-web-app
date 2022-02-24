import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { useAuthUser } from "../../context/AuthUserContext";
import { useMutation } from "@apollo/client";
import { CONFIRM_DELETE_ACCOUNT } from "../../graphql/mutations";
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

function DeleteAccountForm(props) {
  const classes = useStyles();

  const authUser = useAuthUser();

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [open, setOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Resets the password error when the password changes
  useEffect(() => {
    setPasswordError("");
  }, [password]);

  const [confirmDeleteAccount, { loading }] = useMutation(
    CONFIRM_DELETE_ACCOUNT,
    {
      onCompleted: finishConfirmDeleteAccount,
      onError: handleError,
    }
  );

  // Called when the delete account button in the dialog is clicked
  const handleConfirmDeleteAccout = (event) => {
    event.preventDefault();

    if (!password) return;

    confirmDeleteAccount({
      variables: {
        password: password,
      },
    });
  };

  // Called when the initial delete account button is clicked
  const handleDeleteButtonClick = () => {
    setOpen(true);
  };

  // Called when the close button in the dialog is clicked
  const handleClose = () => {
    setPassword("");
    setPasswordError("");
    setOpen(false);
  };

  // Called after the mutation is completed
  function finishConfirmDeleteAccount() {
    setIsCompleted(true);

    setTimeout(() => {
      handleClose();
    }, 5000);
  }

  // Called when the mutation returns an error
  function handleError(error) {
    setPasswordError(error.message);
  }

  return (
    <Paper elevation={0}>
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleDeleteButtonClick}
      >
        Delete Account
      </Button>

      <Dialog open={open}>
        <DialogTitle>
          <Paper className={classes.title} elevation={0}>
            <Typography variant="h6">Delete Account</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Paper>
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            To delete your Cirqls account, you must verify your password
          </DialogContentText>
          {isCompleted && (
            <Alert severity="success">
              {`A confirmation email has been sent to ${authUser?.email}`}
            </Alert>
          )}

          <form noValidate onSubmit={handleConfirmDeleteAccout}>
            <TextField
              variant="outlined"
              margin="normal"
              type="password"
              id="password"
              label="Password"
              required
              fullWidth
              autoFocus
              onChange={(event) => setPassword(event.target.value)}
              disabled={loading || isCompleted}
              error={Boolean(passwordError)}
              helperText={passwordError}
            />
          </form>
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleConfirmDeleteAccout}
            disabled={
              !password || Boolean(passwordError) || loading || isCompleted
            }
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default DeleteAccountForm;
