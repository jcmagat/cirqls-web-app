import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { DELETE_ACCOUNT } from "../graphql/mutations";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Logo from "../components/Navigation/Logo";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  paper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "75vh",
  },
  contentPaper: {
    padding: 32,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
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
    onCompleted: () => setIsCompleted(true),
    onError: handleError,
  });

  useEffect(() => {
    if (isCompleted) return;

    deleteAccount();
  }, [isCompleted, deleteAccount]);

  function handleError(error) {
    setIsCompleted(true);
  }

  return (
    <Container>
      <Logo />

      <Paper className={classes.paper} elevation={0}>
        <Paper className={classes.contentPaper}>
          {error ? (
            <Paper className={classes.content} elevation={0}>
              <Typography variant="h5" paragraph>
                An error occured while deleting your Cirqls account
              </Typography>

              <Typography variant="body1">
                Please make sure to go to the confirmation email
              </Typography>
              <Typography variant="body1" paragraph>
                and click the 'Delete Account' button or copy the complete link
              </Typography>

              <Typography variant="body1">
                If that doesn't work, you could make another request to delete
                your account
              </Typography>
              <Typography variant="body1">
                To do that, you need to log in, go to settings, and click the
                'Delete Account' button
              </Typography>
            </Paper>
          ) : (
            <Paper className={classes.content} elevation={0}>
              <Typography variant="h5" paragraph>
                Your Cirqls account has been permanently deleted
              </Typography>

              <Typography variant="body1" paragraph>
                You can now close this window or go to homepage
              </Typography>

              <Button
                variant="contained"
                color="primary"
                component={Link}
                to={"/"}
              >
                Go to Homepage
              </Button>
            </Paper>
          )}
        </Paper>
      </Paper>
    </Container>
  );
}

export default DeleteAccountPage;
