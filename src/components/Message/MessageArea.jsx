import React, { useState, useEffect, useCallback } from "react";
import { useAuthUser } from "../../context/AuthUserContext";
import { useMessages } from "../../context/MessagesContext";
import { useMutation } from "@apollo/client";
import { READ_MESSAGES } from "../../graphql/mutations";
import { GET_NOTIFICATIONS } from "../../graphql/queries";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import MessageCard from "./MessageCard";
import MessageForm from "./MessageForm";

function MessageArea({ sx }) {
  const authUser = useAuthUser();
  const messages = useMessages();

  /* ========== Mark Unread Messages Read ========== */

  const [unreadMessageIds, setUnreadMessageIds] = useState([]);

  const [readMessages] = useMutation(READ_MESSAGES, {
    refetchQueries: [{ query: GET_NOTIFICATIONS }],
  });

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
    <Box sx={{ ...sx }}>
      {authUser && messages && (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <List sx={{ flexGrow: 1, overflowY: "auto" }}>
            {messages
              .slice()
              .reverse()
              .map((message) => (
                <ListItem
                  key={message.message_id}
                  sx={{
                    justifyContent:
                      authUser.username === message.sender.username
                        ? "flex-end"
                        : "flex-start",
                  }}
                  ref={
                    message.message_id === newMessageId ? newMessageRef : null
                  }
                >
                  <MessageCard message={message} />
                </ListItem>
              ))}
          </List>

          <MessageForm />
        </Box>
      )}
    </Box>
  );
}

export default MessageArea;
