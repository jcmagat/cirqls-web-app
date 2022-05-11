import React, { useState, useEffect, useCallback } from "react";
import { useAuthUser } from "../../context/AuthUserContext";
import { useMessages } from "../../context/MessagesContext";
import { useMessageSender } from "../../context/MessagesContext";
import { useMutation } from "@apollo/client";
import { READ_MESSAGES } from "../../graphql/mutations";
import { GET_NOTIFICATIONS } from "../../graphql/queries";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";

function MessageCard({ message, align }) {
  const sentAtTime = new Date(message.sent_at).toLocaleTimeString("en-us", {
    hour: "numeric",
    minute: "numeric",
  });

  return (
    <Card
      sx={{
        alignSelf: align === "left" ? "flex-start" : "flex-end",
        maxWidth: "80%",
      }}
    >
      <CardContent>
        <Typography>{message.message}</Typography>
        <Typography variant="body2" align={align}>
          {sentAtTime}
        </Typography>
      </CardContent>
    </Card>
  );
}

function MessageForm(props) {
  const sendMessage = useMessageSender();

  const [message, setMessage] = useState("");

  const handleSendMessage = (event) => {
    event.preventDefault();

    sendMessage(message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSendMessage}>
      <Box
        sx={{
          padding: 2,
          display: "flex",
          flexDirection: "row",
          gap: 1,
        }}
      >
        <TextField
          id="message"
          label="Message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          sx={{ flexGrow: 1 }}
        />

        <IconButton type="submit" color="primary">
          <SendIcon />
        </IconButton>
      </Box>
    </form>
  );
}

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
            !message.is_read && message.recipient.user_id === authUser.user_id
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

  // Determines whether the date should be shown above the message
  const shouldShowDate = (newMessage, prevMessage) => {
    const newDate = new Date(newMessage?.sent_at).setHours(0, 0, 0, 0);
    const prevDate = new Date(prevMessage?.sent_at).setHours(0, 0, 0, 0);

    if (newDate > prevDate || !prevMessage) {
      return true;
    }

    return false;
  };

  return (
    <Box sx={{ ...sx }}>
      {authUser && messages && (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 1,
              padding: 1,
            }}
          >
            {messages
              .slice()
              .reverse()
              .map((message, index, array) => (
                <Box
                  key={message.message_id}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                  ref={
                    message.message_id === newMessageId ? newMessageRef : null
                  }
                >
                  {shouldShowDate(message, array[index - 1]) && (
                    <Typography sx={{ alignSelf: "center" }}>
                      {new Date(message.sent_at).toLocaleDateString("en-us", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </Typography>
                  )}

                  <MessageCard
                    message={message}
                    align={
                      message.sender.username === authUser.username
                        ? "right"
                        : "left"
                    }
                  />
                </Box>
              ))}
          </Box>

          <MessageForm />
        </Box>
      )}
    </Box>
  );
}

export default MessageArea;
