import React from "react";
import { makeStyles } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import NavBar from "../components/Navigation/NavBar";
import ConversationList from "../components/Message/ConversationList";
import MessageArea from "../components/Message/MessageArea";

const useStyles = makeStyles({
  paper: {
    marginTop: 80,
    height: "85vh",
    display: "flex",
  },
  conversationList: {
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
          <Paper className={classes.conversationList} elevation={0}>
            <ConversationList />
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
