import React from "react";
import { makeStyles } from "@mui/styles";
import { useConversations } from "../../context/MessagesContext";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ConversationCard from "./ConversationCard";

const useStyles = makeStyles({
  card: {
    width: "100%",
  },
});

function ConversationList(props) {
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
              <ConversationCard conversation={conversation} />
            </Paper>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default ConversationList;
