import React from "react";
import { makeStyles } from "@material-ui/styles";
import { useConversations } from "../../context/MessagesContext";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import MessageListCard from "./MessageListCard";

const useStyles = makeStyles({
  card: {
    width: "100%",
  },
});

function MessageList(props) {
  const classes = useStyles();

  const conversations = useConversations();

  return (
    <Paper elevation={0}>
      <List disablePadding>
        {conversations.map((conversation) => (
          <ListItem
            key={conversation.user.username}
            divider
            dense
            disableGutters
          >
            <Paper className={classes.card} elevation={0}>
              <MessageListCard conversation={conversation} />
            </Paper>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default MessageList;
