import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useMutation } from "@apollo/client";
import { REGISTER } from "../graphql/mutations";

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
}));

function SignupPage(props) {
  const history = useHistory();
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  useEffect(() => {
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
        email: email,
        username: username,
        password: password,
      },
    });
  };

  function finishRegister(data) {
    history.push("/login");
  }

  function handleError(error) {
    if (error.message.includes("Email")) {
      setEmailError(error.message);
    } else if (error.message.includes("Username")) {
      setUsernameError(error.message);
    }
  }

  const handleEmailChange = (email) => {
    setEmail(email);
    setEmailError("");
  };

  const handleUsernameChange = (username) => {
    setUsername(username);
    setUsernameError("");
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
            variant="outlined"
            margin="normal"
            required
            fullWidth
            type="email"
            id="email"
            label="Email"
            autoFocus
            onChange={(event) => handleEmailChange(event.target.value)}
            disabled={loading}
            error={Boolean(emailError)}
            helperText={emailError}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            onChange={(event) => handleUsernameChange(event.target.value)}
            disabled={loading}
            error={Boolean(usernameError)}
            helperText={usernameError}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            type="password"
            id="password"
            label="Password"
            onChange={(event) => setPassword(event.target.value)}
            disabled={loading}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            type="password"
            id="confirm-password"
            label="Confirm Password"
            onChange={(event) => setConfirmPassword(event.target.value)}
            disabled={loading}
            error={Boolean(confirmPasswordError)}
            helperText={confirmPasswordError}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={
              !email ||
              !username ||
              !password ||
              !confirmPassword ||
              Boolean(emailError) ||
              Boolean(usernameError) ||
              Boolean(confirmPasswordError) ||
              loading
            }
          >
            Signup
          </Button>
        </form>
        {loading && <CircularProgress />}
      </Paper>
    </Container>
  );
}

export default SignupPage;
