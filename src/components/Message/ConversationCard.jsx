import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import { useHistory } from "react-router-dom";
import { useNotifications } from "../../context/NotificationsContext";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";

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

  const notifications = useNotifications();

  const [unreadMessages, setUnreadMessages] = useState([]);

  useEffect(() => {
    setUnreadMessages(
      notifications.filter(
        (notification) =>
          notification.__typename === "Message" &&
          notification.sender.user_id === conversation.user.user_id
      )
    );
  }, [notifications, conversation]);

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
            <Badge color="secondary" badgeContent={unreadMessages.length} />
          }
          classes={{ action: classes.action }}
        />
      </CardActionArea>
    </Card>
  );
}

export default ConversationCard;
