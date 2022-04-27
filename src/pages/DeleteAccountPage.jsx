import React, { useState, useEffect } from "react";
import makeStyles from '@mui/styles/makeStyles';
import { useParams } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { DELETE_ACCOUNT } from "../graphql/mutations";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Logo from "../components/Navigation/Logo";

const useStyles = makeStyles({
  paper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "75vh",
  },
  content: {
    padding: 32,
    maxWidth: 600,
    textAlign: "center",
  },
});

function DeleteAccountPage(props) {
  const classes = useStyles();

  const { token } = useParams();

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
    <Container>
      <Logo />

      <Paper className={classes.paper}>
        <Paper className={classes.content} elevation={1}>
          {error ? (
            <>
              <Typography variant="h5" paragraph>
                An error occured while deleting your Cirqls account
              </Typography>

              <Typography variant="body1" paragraph>
                Please make sure to go to the confirmation email and click the
                'Delete Account' button or copy the entire link
              </Typography>

              <Typography variant="body1" paragraph>
                If that doesn't work, you could make another request to delete
                your account. To do that, you need to log in, go to settings,
                and click the 'Delete Account' button
              </Typography>

              <Link href={"/"}>
                <Button variant="contained" color="primary">
                  Go to Homepage
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Typography variant="h5" paragraph>
                Your Cirqls account has been permanently deleted
              </Typography>

              <Typography variant="body1" paragraph>
                You can now close this window or go to homepage
              </Typography>

              <Link href={"/"}>
                <Button variant="contained" color="primary">
                  Go to Homepage
                </Button>
              </Link>
            </>
          )}
        </Paper>
      </Paper>
    </Container>
  );
}

export default DeleteAccountPage;
