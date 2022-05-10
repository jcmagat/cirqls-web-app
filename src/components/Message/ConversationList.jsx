import React from "react";
import { makeStyles } from "@mui/styles";
import { useConversations } from "../../context/MessagesContext";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ConversationCard from "./ConversationCard";

const useStyles = makeStyles({
  card: {
    width: "100%",
  },
});

function ConversationList({ sx }) {
  const classes = useStyles();

  const conversations = useConversations();

  return (
    <Box sx={{ ...sx }}>
      <List disablePadding>
        {conversations.map((conversation) => (
          <ListItem
            key={conversation.user.username}
            divider
            dense
            disableGutters
          >
            <Box className={classes.card}>
              <ConversationCard conversation={conversation} />
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default ConversationList;
