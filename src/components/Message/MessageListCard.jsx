import React from "react";
import { useHistory } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";

function MessageListCard({ conversation }) {
  const history = useHistory();

  const handleClick = () => {
    history.push({ search: `user=${conversation.user.username}` });
  };

  return (
    <Card>
      <CardActionArea onClick={handleClick}>
        <CardHeader
          avatar={<Avatar src={conversation.user.profile_pic_src} />}
          title={conversation.user.username}
          subheader={conversation.messages[0].message}
        />
      </CardActionArea>
    </Card>
  );
}

export default MessageListCard;
