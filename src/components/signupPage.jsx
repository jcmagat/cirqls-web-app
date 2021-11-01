import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import Button from "@material-ui/core/Button";
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

  // eslint-disable-next-line
  const [register, { loading, error }] = useMutation(REGISTER, {
    onCompleted: finishRegister,
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
    history.push("/");
  }

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
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
            onChange={(event) => setEmail(event.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            onChange={(event) => setUsername(event.target.value)}
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
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Signup
          </Button>
        </form>
      </div>
    </Container>
  );
}

export default SignupPage;
