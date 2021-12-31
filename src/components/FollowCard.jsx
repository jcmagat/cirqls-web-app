import React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";

function FollowCard(props) {
  const followSinceDate = new Date(props.user.followed_at).toLocaleDateString(
    "en-us",
    {
      month: "long",
      year: "numeric",
    }
  );

  return (
    <Card>
      <CardHeader
        avatar={<Avatar>{props.user.username.charAt(0).toUpperCase()}</Avatar>}
        title={props.user.username}
        subheader={`${props.type} since ${followSinceDate}`}
      />
    </Card>
  );
}

export default FollowCard;
