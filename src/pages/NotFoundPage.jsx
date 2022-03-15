import React from "react";
import { makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Logo from "../components/Navigation/Logo";

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
  buttons: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
  },
});

function NotFoundPage(props) {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Container>
      <Logo />

      <Paper className={classes.paper} elevation={0}>
        <Paper className={classes.contentPaper}>
          <Paper className={classes.content} elevation={0}>
            <Typography variant="h5" paragraph>
              Page Not Found
            </Typography>

            <Typography variant="body1" paragraph>
              You may have encountered a broken link
            </Typography>

            <Typography variant="body1" paragraph>
              You could go back to the previous page or go to homepage
            </Typography>

            <Paper className={classes.buttons} elevation={0}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => history.goBack()}
              >
                Go Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => history.push("/")}
              >
                Go to Homepage
              </Button>
            </Paper>
          </Paper>
        </Paper>
      </Paper>
    </Container>
  );
}

export default NotFoundPage;
