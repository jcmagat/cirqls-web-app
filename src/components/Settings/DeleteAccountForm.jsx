import React, { useState, useEffect } from "react";
import makeStyles from "@mui/styles/makeStyles";
import { useAuthUser } from "../../context/AuthUserContext";
import { useMutation } from "@apollo/client";
import { CONFIRM_DELETE_ACCOUNT } from "../../graphql/mutations";
import Paper from "@mui/material/Paper";
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

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "center",
  },
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
    <Paper className={classes.root} elevation={0}>
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
            <IconButton onClick={handleClose} size="large">
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
