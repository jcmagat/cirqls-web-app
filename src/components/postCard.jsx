import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles({
  pos: {
    marginBottom: 12,
  },
});

function timeDifference(current, previous) {
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  const elapsed = current - previous;

  if (elapsed < msPerMinute) {
    return "just now";
  } else if (elapsed < msPerHour) {
    const time = Math.round(elapsed / msPerMinute);
    const ago = time > 1 ? " minutes ago" : " minute ago";
    return time + ago;
  } else if (elapsed < msPerDay) {
    const time = Math.round(elapsed / msPerHour);
    const ago = time > 1 ? " hours ago" : " hour ago";
    return time + ago;
  } else if (elapsed < msPerMonth) {
    const time = Math.round(elapsed / msPerDay);
    const ago = time > 1 ? " days ago" : " day ago";
    return time + ago;
  } else if (elapsed < msPerYear) {
    const time = Math.round(elapsed / msPerMonth);
    const ago = time > 1 ? " months ago" : " month ago";
    return time + ago;
  } else {
    const time = Math.round(elapsed / msPerYear);
    const ago = time > 1 ? " years ago" : " year ago";
    return time + ago;
  }
}

function PostCard(props) {
  const classes = useStyles();

  const postedOn = new Date(props.post.postedOn).getTime();
  const postedSince = timeDifference(props.currentDate, postedOn);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{props.post.title}</Typography>
        <Typography
          className={classes.pos}
          variant="subtitle2"
          color="textSecondary"
        >
          posted {postedSince} by {props.post.postedBy}
        </Typography>
        <Typography variant="body1">{props.post.message}</Typography>
      </CardContent>
      <CardActions>
        <IconButton
          onClick={(id) => props.deletePost(props.post._id, id)}
          aria-label="delete"
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default PostCard;
