import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../graphql/mutations";

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

function LoginPage(props) {
  const classes = useStyles();
  const history = useHistory();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [login, { loading }] = useMutation(LOGIN, {
    onCompleted: finishLogin,
    onError: handleError,
  });

  const handleLogin = (event) => {
    event.preventDefault();

    login({
      variables: {
        username: username,
        password: password,
      },
    });
  };

  function finishLogin(data) {
    localStorage.setItem("username", data.login.username);
    localStorage.setItem("token", data.login.accessToken);
    history.push("/");
  }

  function handleError(error) {
    setError(error.message);
  }

  const handleUsernameChange = (username) => {
    setUsername(username);
    setError("");
  };

  const handlePasswordChange = (password) => {
    setPassword(password);
    setError("");
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={0}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Log In
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleLogin}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            autoComplete="username"
            autoFocus
            onChange={(event) => handleUsernameChange(event.target.value)}
            disabled={loading}
            error={Boolean(error)}
            helperText={error}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            type="password"
            id="password"
            label="Password"
            autoComplete="current-password"
            onChange={(event) => handlePasswordChange(event.target.value)}
            disabled={loading}
            error={Boolean(error)}
          />
          <Button
            className={classes.submit}
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            disabled={!username || !password || loading}
          >
            Login
          </Button>
        </form>
        <Typography component={Link} to={"/signup"}>
          Don't have an account? Sign Up
        </Typography>
        {loading && <CircularProgress />}
      </Paper>
    </Container>
  );
}

export default LoginPage;
