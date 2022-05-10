import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useConversations } from "../../context/MessagesContext";
import { useUnreadMessages } from "../../context/NotificationsContext";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";

function ConversationCard({ conversation }) {
  const history = useHistory();

  const unreadMessages = useUnreadMessages();

  const [cardUnreadMessages, setCardUnreadMessages] = useState([]);

  useEffect(() => {
    setCardUnreadMessages(
      unreadMessages.filter(
        (message) => message.sender.user_id === conversation.user.user_id
      )
    );
  }, [unreadMessages, conversation]);

  return (
    <>
      <Card elevation={0}>
        <CardActionArea
          onClick={() =>
            history.push({ search: `user=${conversation.user.username}` })
          }
        >
          <CardHeader
            avatar={<Avatar src={conversation.user.profile_pic_src} />}
            title={`u/${conversation.user.username}`}
            subheader={conversation.messages[0].message}
            subheaderTypographyProps={{
              noWrap: true,
            }}
            action={
              <Badge color="primary" badgeContent={cardUnreadMessages.length} />
            }
            sx={{
              "& .MuiCardHeader-content": {
                overflow: "hidden",
                paddingRight: 3,
              },
              "& .MuiCardHeader-action": {
                alignSelf: "center",
                marginRight: 1,
              },
            }}
          />
        </CardActionArea>
      </Card>

      <Divider />
    </>
  );
}

function ConversationList({ sx }) {
  const conversations = useConversations();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", ...sx }}>
      {conversations.map((conversation) => (
        <ConversationCard
          key={conversation.user.user_id}
          conversation={conversation}
        />
      ))}
    </Box>
  );
}

export default ConversationList;
