import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useMutation } from "@apollo/client";
import { DELETE_ACCOUNT } from "../graphql/mutations";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Logo from "../components/Navigation/Logo";

function DeleteAccountPage(props) {
  const { token } = useParams();

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const [isCompleted, setIsCompleted] = useState(false);

  const [deleteAccount, { error }] = useMutation(DELETE_ACCOUNT, {
    variables: {
      token: token,
    },
    onCompleted: finishDeleteAccount,
    onError: handleError,
  });

  useEffect(() => {
    if (isCompleted) return;

    deleteAccount();
  }, [isCompleted, deleteAccount]);

  function finishDeleteAccount(data) {
    localStorage.removeItem("token");
    setIsCompleted(true);
  }

  function handleError(error) {
    setIsCompleted(true);
  }

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
        {error ? (
          <>
            <Typography variant="h5" paragraph>
              An error occured while deleting your
              <br />
              Cirqls account
            </Typography>

            <Typography variant="body1" paragraph>
              Please make sure to go to the confirmation email
              <br />
              and click the 'Delete Account' button or copy the entire link
            </Typography>

            <Typography variant="body1" paragraph sx={{ marginBottom: 4 }}>
              You could also make another request to delete your
              <br />
              account. Go to settings and click the 'Delete Account' button
            </Typography>

            <Button variant="contained" color="primary" href={"/"}>
              Go to Homepage
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h5" paragraph>
              Your Cirqls account has been
              <br />
              permanently deleted
            </Typography>

            <Typography variant="body1" paragraph sx={{ marginBottom: 4 }}>
              You can now close this window or go to homepage
            </Typography>

            <Button variant="contained" color="primary" href={"/"}>
              Go to Homepage
            </Button>
          </>
        )}
      </Paper>
    </Container>
  );
}

export default DeleteAccountPage;
