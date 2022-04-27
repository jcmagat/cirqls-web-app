import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import makeStyles from "@mui/styles/makeStyles";
import { useParams } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { REGISTER } from "../graphql/mutations";
import isStrongPassword from "validator/lib/isStrongPassword";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import Button from "@mui/material/Button";
import Popper from "@mui/material/Popper";
import CircularProgress from "@mui/material/CircularProgress";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  popper: {
    padding: 16,
    marginLeft: 16,
  },
}));

function SignUpPage(props) {
  const history = useHistory();
  const classes = useStyles();

  const { token } = useParams();

  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Resets the username error message when the username changes
  useEffect(() => {
    setUsernameError("");
  }, [username]);

  useEffect(() => {
    // Checks whether the new password is strong enough
    if (password && !isStrongPassword(password, { minSymbols: 0 })) {
      setPasswordError("Password not strong enough");
    } else {
      setPasswordError("");
    }

    // Checks whether confirm password matches the password
    if (confirmPassword && password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  }, [password, confirmPassword]);

  const [register, { loading }] = useMutation(REGISTER, {
    onCompleted: finishRegister,
    onError: handleError,
  });

  const handleRegister = (event) => {
    event.preventDefault();

    register({
      variables: {
        token: token,
        username: username,
        password: password,
      },
    });
  };

  function finishRegister(data) {
    history.push("/login");
  }

  function handleError(error) {
    if (error.message.includes("Username")) {
      setUsernameError(error.message);
    }
  }

  /* ========== Password Popper ========== */

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleFocusPassword = (event) => {
    setOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const handleUnfocusPassword = () => {
    if (!password || passwordError) return;

    setOpen(false);
    setAnchorEl(null);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={0}>
        <Avatar className={classes.avatar}>
          <PersonOutlineOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleRegister}>
          <TextField
            margin="normal"
            id="username"
            label="Username"
            required
            fullWidth
            autoFocus
            onChange={(event) => setUsername(event.target.value)}
            disabled={loading}
            error={Boolean(usernameError)}
            helperText={usernameError}
          />

          <TextField
            margin="normal"
            type="password"
            id="password"
            label="Password"
            required
            fullWidth
            onChange={(event) => setPassword(event.target.value)}
            onFocus={(event) => handleFocusPassword(event)}
            onBlur={handleUnfocusPassword}
            disabled={loading}
            error={Boolean(passwordError)}
            helperText={passwordError}
          />
          <Popper open={open} anchorEl={anchorEl} placement="right">
            <Paper className={classes.popper}>
              <Typography variant="body2">
                Password must contain:
                <li>Minimum 8 characters</li>
                <li>At least 1 uppercase</li>
                <li>At least 1 lowercase</li>
                <li>At least 1 number</li>
              </Typography>
            </Paper>
          </Popper>

          <TextField
            margin="normal"
            type="password"
            id="confirm-password"
            label="Confirm Password"
            required
            fullWidth
            onChange={(event) => setConfirmPassword(event.target.value)}
            disabled={loading}
            error={Boolean(confirmPasswordError)}
            helperText={confirmPasswordError}
          />
          <Button
            className={classes.submit}
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            disabled={
              !username ||
              !password ||
              !confirmPassword ||
              Boolean(usernameError) ||
              Boolean(confirmPasswordError) ||
              Boolean(passwordError) ||
              loading
            }
          >
            Sign Up
          </Button>
        </form>
        <Typography component={Link} to={"/login"}>
          Already have an account? Log In
        </Typography>
        {loading && <CircularProgress />}
      </Paper>
    </Container>
  );
}

export default SignUpPage;
