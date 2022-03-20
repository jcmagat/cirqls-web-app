import React, { useState, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/styles";
import { useAuthUser } from "../../context/AuthUserContext";
import { useMessages } from "../../context/MessagesContext";
import { useMutation } from "@apollo/client";
import { READ_MESSAGES } from "../../graphql/mutations";
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

  /* ========== Mark Unread Messages Read ========== */

  const [unreadMessageIds, setUnreadMessageIds] = useState([]);

  const [readMessages] = useMutation(READ_MESSAGES);

  useEffect(() => {
    if (!authUser) return;

    setUnreadMessageIds(
      messages
        .filter(
          (message) =>
            message.sender.user_id !== authUser.user_id && !message.is_read
        )
        .map((message) => message.message_id)
    );
  }, [messages, authUser]);

  useEffect(() => {
    if (!Array.isArray(unreadMessageIds) || unreadMessageIds.length < 1) return;

    readMessages({
      variables: {
        message_ids: unreadMessageIds,
      },
    });
  }, [unreadMessageIds, readMessages]);

  /* ========== Scroll to New Message ========== */

  const [newMessageId, setNewMessageId] = useState();

  useEffect(() => {
    if (!Array.isArray(messages) || messages.length < 1) return;

    setNewMessageId(messages[0].message_id);
  }, [messages]);

  const newMessageRef = useCallback((node) => {
    if (node) node.scrollIntoView();
  }, []);

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
                  ref={
                    message.message_id === newMessageId ? newMessageRef : null
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
