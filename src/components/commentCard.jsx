import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  comment: {
    position: "relative",
    top: -16,
  },
});

function CommentCard(props) {
  const classes = useStyles();

  return (
    <Card className={classes.comment}>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {props.comment.username}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          {props.comment.comment_id}
        </Typography>
        <Typography variant="h5" component="h2">
          {props.comment.message}
        </Typography>
        <Typography color="textSecondary">
          {props.comment.created_since}
        </Typography>

        <Typography variant="body2" component="p">
          parent_comment_id:
          {props.comment.parent_comment_id}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}

export default CommentCard;
