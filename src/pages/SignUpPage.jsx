import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { REGISTER } from "../graphql/mutations";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
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
}));

function SignUpPage(props) {
  const history = useHistory();
  const classes = useStyles();

  const { token } = useParams();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
            id="username"
            label="Username"
            required
            fullWidth
            autoFocus
            onChange={(event) => handleUsernameChange(event.target.value)}
            disabled={loading}
            error={Boolean(usernameError)}
            helperText={usernameError}
          />
          <TextField
            variant="outlined"
            margin="normal"
            type="password"
            id="password"
            label="Password"
            required
            fullWidth
            onChange={(event) => setPassword(event.target.value)}
            disabled={loading}
          />
          <TextField
            variant="outlined"
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
