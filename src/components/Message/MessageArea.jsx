import React from "react";
import { makeStyles } from "@material-ui/styles";
import { useAuthUser } from "../../context/AuthUserContext";
import { useMessages } from "../../context/MessagesContext";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import MessageCard from "./MessageCard";
import MessageForm from "./MessageForm";

const useStyles = makeStyles({
  paper: {
    height: "100%",
  },
  area: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  messages: {
    flexGrow: 1,
    overflowY: "auto",
  },
  leftMessage: {
    justifyContent: "flex-start",
  },
  rightMessage: {
    justifyContent: "flex-end",
  },
});

function MessageArea(props) {
  const classes = useStyles();

  const authUser = useAuthUser();
  const messages = useMessages();

  return (
    <Paper className={classes.paper} elevation={0}>
      {authUser && messages && (
        <Paper className={classes.area} elevation={0}>
          <List className={classes.messages}>
            {messages
              .slice()
              .reverse()
              .map((message) => (
                <ListItem
                  key={message.message_id}
                  className={
                    authUser.username === message.sender.username
                      ? classes.rightMessage
                      : classes.leftMessage
                  }
                >
                  <MessageCard message={message} />
                </ListItem>
              ))}
          </List>

          <MessageForm />
        </Paper>
      )}
    </Paper>
  );
}

export default MessageArea;
