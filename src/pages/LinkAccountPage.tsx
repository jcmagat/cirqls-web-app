import useMediaQuery from "@mui/material/useMediaQuery";
import { Theme } from "@mui/material";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Logo from "../components/Navigation/Logo";

function LinkAccountPage() {
  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  return (
    <Container disableGutters maxWidth={false}>
      <Logo sx={{ padding: 2 }} size="normal" />

      <Paper
        sx={{
          padding: 4,
          textAlign: "center",
          width: "fit-content",
          position: "absolute",
          top: "25%",
          left: "50%",
          transform: "translateX(-50%)",
        }}
        elevation={isSmallScreen ? 0 : 1}
      >
        <Typography variant="h5" paragraph>
          An error occured while signing up with your Google account
        </Typography>

        <Typography variant="body1" paragraph>
          The email address of the Google account you are trying to sign up with
          is already registered to a Cirqls account
        </Typography>

        <Typography variant="body1" paragraph>
          In the future, you will be able to link your existing Cirqls account
          to your Google account
        </Typography>

        <Typography variant="body1" paragraph sx={{ marginBottom: 4 }}>
          For now, please log in with your username and password or go to
          homepage
        </Typography>

        <Button variant="outlined" href="/" sx={{ marginRight: 1 }}>
          Go to Homepage
        </Button>

        <Button variant="contained" href="/login">
          Log in
        </Button>
      </Paper>
    </Container>
  );
}

export default LinkAccountPage;
