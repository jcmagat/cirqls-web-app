import React from "react";
import makeStyles from '@mui/styles/makeStyles';
import { useHistory } from "react-router-dom";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
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
    textAlign: "center",
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

      <Paper className={classes.paper}>
        <Paper className={classes.content} elevation={1}>
          <Typography variant="h5" paragraph>
            Page Not Found
          </Typography>

          <Typography variant="body1" paragraph>
            You may have encountered a broken link
          </Typography>

          <Typography variant="body1" paragraph>
            You could go back to the previous page or go to homepage
          </Typography>

          <Paper className={classes.buttons}>
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
    </Container>
  );
}

export default NotFoundPage;
