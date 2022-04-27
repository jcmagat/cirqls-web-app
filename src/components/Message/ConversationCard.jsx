import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { useHistory } from "react-router-dom";
import { useUnreadMessages } from "../../context/NotificationsContext";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";

const useStyles = makeStyles({
  card: {
    boxShadow: "none",
  },
  action: {
    margin: "auto",
  },
});

function ConversationCard({ conversation }) {
  const classes = useStyles();
  const history = useHistory();

  const unreadMessages = useUnreadMessages();

  const [myUnreadMessages, setMyUnreadMessages] = useState([]);

  useEffect(() => {
    setMyUnreadMessages(
      unreadMessages.filter(
        (message) => message.sender.user_id === conversation.user.user_id
      )
    );
  }, [unreadMessages, conversation]);

  const handleClick = () => {
    history.push({ search: `user=${conversation.user.username}` });
  };

  return (
    <Card className={classes.card}>
      <CardActionArea onClick={handleClick}>
        <CardHeader
          avatar={<Avatar src={conversation.user.profile_pic_src} />}
          title={conversation.user.username}
          subheader={conversation.messages[0].message}
          action={
            <Badge color="secondary" badgeContent={myUnreadMessages.length} />
          }
          classes={{ action: classes.action }}
        />
      </CardActionArea>
    </Card>
  );
}

export default ConversationCard;
