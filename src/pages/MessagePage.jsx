import React from "react";
import { makeStyles } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import NavBar from "../components/NavBar";
import MessageArea from "../components/Message/MessageArea";

const useStyles = makeStyles({
  paper: {
    marginTop: 80,
    height: "85vh",
  },
});

function MessagesPage(props) {
  const classes = useStyles();

  return (
    <Container>
      <Paper elevation={0}>
        <NavBar />

        <Paper className={classes.paper}>
          <MessageArea />
        </Paper>
      </Paper>
    </Container>
  );
}

export default MessagesPage;
