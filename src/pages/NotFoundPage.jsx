import React from "react";
import { useHistory } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Logo from "../components/Navigation/Logo";

function NotFoundPage(props) {
  const history = useHistory();

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  return (
    <Container disableGutters maxWidth={false}>
      <Logo sx={{ padding: 2 }} />

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
          Page Not Found
        </Typography>

        <Typography variant="body1" paragraph>
          You may have encountered a broken link
        </Typography>

        <Typography variant="body1" paragraph sx={{ marginBottom: 4 }}>
          You could go back to the previous page or go to homepage
        </Typography>

        <Button
          variant="outlined"
          color="primary"
          onClick={() => history.goBack()}
          sx={{ marginRight: 1 }}
        >
          Go Back
        </Button>

        <Button variant="contained" color="primary" href="/">
          Go to Homepage
        </Button>
      </Paper>
    </Container>
  );
}

export default NotFoundPage;
