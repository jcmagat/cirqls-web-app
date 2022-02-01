import React from "react";
import { makeStyles } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import NavBar from "../components/Navigation/NavBar";
import MessageList from "../components/Message/MessageList";
import MessageArea from "../components/Message/MessageArea";

const useStyles = makeStyles({
  paper: {
    marginTop: 80,
    height: "85vh",
    display: "flex",
  },
  messageList: {
    width: "20%",
  },
  messageArea: {
    flexGrow: 1,
  },
});

function MessagesPage(props) {
  const classes = useStyles();

  return (
    <Container>
      <Paper elevation={0}>
        <NavBar />

        <Paper className={classes.paper}>
          <Paper className={classes.messageList} elevation={0}>
            <MessageList />
          </Paper>

          <Divider orientation="vertical" />

          <Paper className={classes.messageArea} elevation={0}>
            <MessageArea />
          </Paper>
        </Paper>
      </Paper>
    </Container>
  );
}

export default MessagesPage;
