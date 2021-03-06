import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useMutation, ApolloError } from "@apollo/client";
import { SIGNUP } from "../graphql/mutations";
import isStrongPassword from "validator/lib/isStrongPassword";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import Button from "@mui/material/Button";
import Popper from "@mui/material/Popper";
import Link from "@mui/material/Link";

function SignUpPage() {
  const history = useHistory();

  const isSmallScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.down("md")
  );

  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [open, setOpen] = useState(false);

  // Resets the username error message when the username changes
  useEffect(() => {
    setUsernameError("");
  }, [username]);

  // Sets the password and confirm password error messages
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

  // Opens the password hint popper
  useEffect(() => {
    if (!anchorEl) return;

    if (!password || passwordError) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [anchorEl, password, passwordError]);

  const [signup, { loading }] = useMutation(SIGNUP, {
    onCompleted: () => history.push("/"),
    onError: handleError,
  });

  const handleSignUp = (event: any) => {
    event.preventDefault();

    if (usernameError || passwordError || confirmPasswordError) {
      return;
    }

    if (!username) {
      setUsernameError("Please provide a username");
      return;
    } else if (!password) {
      setPasswordError("Please provide a password");
      return;
    } else if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      return;
    }

    signup({
      variables: {
        username: username,
        password: password,
      },
    });
  };

  function handleError(error: ApolloError) {
    if (error.message.includes("Username")) {
      setUsernameError(error.message);
    }
  }

  return (
    <Container maxWidth="xs">
      <Box sx={{ marginTop: 12, textAlign: "center" }}>
        <Avatar sx={{ marginInline: "auto" }}>
          <PersonOutlineOutlinedIcon />
        </Avatar>

        <Typography variant="h5" sx={{ marginBottom: 3 }}>
          Sign Up
        </Typography>

        <form noValidate onSubmit={handleSignUp}>
          <TextField
            margin="dense"
            id="username"
            label="Username"
            fullWidth
            autoFocus
            onChange={(event) => setUsername(event.target.value)}
            disabled={loading}
            error={Boolean(usernameError)}
            helperText={usernameError}
          />

          <TextField
            margin="dense"
            type="password"
            id="password"
            label="Password"
            fullWidth
            onChange={(event) => setPassword(event.target.value)}
            onFocus={(event) => setAnchorEl(event.currentTarget)}
            disabled={loading}
            error={Boolean(passwordError)}
            helperText={passwordError}
          />

          <TextField
            margin="dense"
            type="password"
            id="confirm-password"
            label="Confirm Password"
            fullWidth
            onChange={(event) => setConfirmPassword(event.target.value)}
            disabled={loading}
            error={Boolean(confirmPasswordError)}
            helperText={confirmPasswordError}
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            sx={{ marginTop: 1, marginBottom: 4 }}
          >
            Sign Up
          </Button>
        </form>

        <Popper
          open={open}
          anchorEl={anchorEl}
          placement={isSmallScreen ? "bottom-start" : "right-start"}
          sx={{ zIndex: 2 }}
        >
          <Paper
            sx={{
              padding: 2,
              marginTop: isSmallScreen ? (Boolean(passwordError) ? 3 : 1) : 0,
              marginLeft: isSmallScreen ? 0 : 1,
            }}
          >
            <Typography variant="body2">
              Password must contain at least:
              <li>8 characters</li>
              <li>1 lower case letter</li>
              <li>1 upper case letter</li>
              <li>1 number</li>
            </Typography>
          </Paper>
        </Popper>

        <Typography component={Link} href={"/login"}>
          Already have an account? Log In
        </Typography>
      </Box>
    </Container>
  );
}

export default SignUpPage;
