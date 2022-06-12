import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useMutation, ApolloError } from "@apollo/client";
import { LOGIN } from "../graphql/mutations";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import GoogleOAuthButton from "../components/Common/GoogleOAuthButton";

function LoginPage() {
  const history = useHistory();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [login, { loading }] = useMutation(LOGIN, {
    onCompleted: () => history.push("/"),
    onError: handleError,
  });

  const handleLogin = (event: any) => {
    event.preventDefault();

    login({
      variables: {
        username: username,
        password: password,
      },
    });
  };

  function handleError(error: ApolloError) {
    setError(error.message);
  }

  const handleUsernameChange = (username: string) => {
    setUsername(username);
    setError("");
  };

  const handlePasswordChange = (password: string) => {
    setPassword(password);
    setError("");
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 12,
          textAlign: "center",
        }}
      >
        <Avatar sx={{ marginInline: "auto" }}>
          <PersonOutlineOutlinedIcon />
        </Avatar>

        <Typography variant="h5" sx={{ marginBottom: 3 }}>
          Log in
        </Typography>

        <GoogleOAuthButton label="Log in with Google" />

        <Typography sx={{ marginTop: 2, marginBottom: 2 }}>OR</Typography>

        <form noValidate onSubmit={handleLogin}>
          <TextField
            id="username"
            label="Username"
            autoComplete="username"
            fullWidth
            onChange={(event) => handleUsernameChange(event.target.value)}
            disabled={loading}
            error={Boolean(error)}
            helperText={error}
          />

          <TextField
            type="password"
            id="password"
            label="Password"
            autoComplete="current-password"
            margin="dense"
            fullWidth
            onChange={(event) => handlePasswordChange(event.target.value)}
            disabled={loading}
            error={Boolean(error)}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ marginTop: 1, marginBottom: 4 }}
          >
            Login
          </Button>
        </form>

        <Typography component={Link} href={"/"}>
          Don't have an account? Sign Up
        </Typography>
      </Box>
    </Container>
  );
}

export default LoginPage;
