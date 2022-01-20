import React from "react";
import { useAuthUser } from "../../context/AuthUserContext";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import MessageCard from "./MessageCard";
import MessageForm from "./MessageForm";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  messageList: {
    maxHeight: 650,
    overflow: "auto",
  },
  leftMessage: {
    justifyContent: "flex-start",
  },
  rightMessage: {
    justifyContent: "flex-end",
  },
});

function MessageArea({ messages, user }) {
  const classes = useStyles();

  const authUser = useAuthUser();

  return (
    <Paper elevation={0}>
      {authUser && (
        <Paper elevation={0}>
          <List className={classes.messageList}>
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

          <MessageForm user={user} />
        </Paper>
      )}
    </Paper>
  );
}

export default MessageArea;
