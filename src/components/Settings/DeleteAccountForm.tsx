import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useMutation, ApolloError } from "@apollo/client";
import { DELETE_ACCOUNT } from "../../graphql/mutations";
import { SxProps, Theme } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface Props {
  sx?: SxProps<Theme>;
}

function DeleteAccountForm(props: Props) {
  const { sx } = props;

  const history = useHistory();

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [open, setOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Resets the password error when the password changes
  useEffect(() => {
    setPasswordError("");
  }, [password]);

  const [deleteAccount, { loading }] = useMutation(DELETE_ACCOUNT, {
    onCompleted: handleCompleted,
    onError: handleError,
  });

  // Called when the delete account button in the dialog is clicked
  const handleDeleteAccout = (event: any) => {
    event.preventDefault();

    if (passwordError) return;

    if (!password) {
      setPasswordError("Please verify your password");
      return;
    }

    deleteAccount({
      variables: {
        password: password,
      },
    });
  };

  // Called when the close button in the dialog is clicked
  const handleClose = () => {
    setPassword("");
    setPasswordError("");
    setOpen(false);
  };

  // Called after the mutation is completed
  function handleCompleted() {
    setIsCompleted(true);

    setTimeout(() => {
      history.push("/");
    }, 5000);
  }

  // Called when the mutation returns an error
  function handleError(error: ApolloError) {
    setPasswordError(error.message);
  }

  return (
    <>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => setOpen(true)}
        sx={{ ...sx }}
      >
        Delete Account
      </Button>

      <Dialog open={open}>
        <DialogTitle
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingRight: 1,
          }}
        >
          Delete Account
          <IconButton onClick={handleClose} disabled={loading || isCompleted}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            To delete your Cirqls account, you must verify your password
          </DialogContentText>

          {isCompleted && (
            <Alert severity="success">
              {`Your Cirqls account has been permanently deleted`}
            </Alert>
          )}

          <form noValidate onSubmit={handleDeleteAccout}>
            <TextField
              margin="normal"
              type="password"
              id="password"
              label="Password"
              fullWidth
              autoFocus
              onChange={(event) => setPassword(event.target.value)}
              disabled={loading || isCompleted}
              error={Boolean(passwordError)}
              helperText={passwordError}
            />
          </form>
        </DialogContent>

        <DialogActions sx={{ paddingBottom: 3, paddingRight: 3 }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            disabled={loading || isCompleted}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteAccout}
            disabled={loading || isCompleted}
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default DeleteAccountForm;
