import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useUnreadMessages } from "../../context/NotificationsContext";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
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

function ConversationList({ conversations, sx }) {
  return (
    <Box
      sx={{ width: "100%", display: "flex", flexDirection: "column", ...sx }}
    >
      {Array.isArray(conversations) && conversations.length <= 0 && (
        <Typography sx={{ alignSelf: "center", marginTop: 8 }}>
          Your messages will be displayed here
        </Typography>
      )}

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
