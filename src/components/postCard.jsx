import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

function PostCard(props) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{props.post.postedBy}</Typography>
        <Typography variant="p">
          {props.post.postedOn}
          <br />
        </Typography>
        <Typography variant="p">{props.post.message}</Typography>
      </CardContent>
    </Card>
  );
}

export default PostCard;
