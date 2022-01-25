import React from "react";
import { useConversations } from "../../context/MessagesContext";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { Link } from "react-router-dom";

function MessageList(props) {
  const conversations = useConversations();

  return (
    <Paper elevation={1}>
      <List>
        {conversations.map((conversation) => (
          <ListItem>
            <Paper
              key={conversation.user.username}
              component={Link}
              to={`/messages?user=${conversation.user.username}`}
            >
              <h1>{conversation.user.username}</h1>
            </Paper>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default MessageList;
