import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import ThumbUpOutlinedIcon from "@material-ui/icons/ThumbUpOutlined";
import ThumbDownOutlinedIcon from "@material-ui/icons/ThumbDownOutlined";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  comment: {
    position: "relative",
    top: -16,
    // boxShadow: "none",
  },
});

function CommentCard(props) {
  const classes = useStyles();

  const authUserReaction = props.comment.reactions.auth_user_reaction;
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  useEffect(() => {
    if (authUserReaction === "like") {
      setLiked(true);
      setDisliked(false);
    } else if (authUserReaction === "dislike") {
      setLiked(false);
      setDisliked(true);
    } else {
      setLiked(false);
      setDisliked(false);
    }
  }, [authUserReaction]);

  return (
    <Card className={classes.comment}>
      <CardContent>
        <Grid container spacing={1}>
          <Grid item>
            <AccountCircleOutlinedIcon />
          </Grid>
          <Grid item>
            <Typography variant="subtitle1">
              {props.comment.username}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1">
              {props.comment.created_since}
            </Typography>
          </Grid>
        </Grid>

        <Typography variant="h6">{props.comment.message}</Typography>
      </CardContent>

      <CardActions disableSpacing>
        {liked ? (
          <IconButton
          // onClick={(post_id) =>
          //   handleDeletePostReaction(props.post.post_id, post_id)
          // }
          >
            <ThumbUpIcon />
          </IconButton>
        ) : (
          <IconButton
          // onClick={(post_id) => handleLikePost(props.post.post_id, post_id)}
          >
            <ThumbUpOutlinedIcon />
          </IconButton>
        )}

        <Typography variant="subtitle1">
          {props.comment.reactions.total}
        </Typography>

        {disliked ? (
          <IconButton
          // onClick={(post_id) =>
          //   handleDeletePostReaction(props.post.post_id, post_id)
          // }
          >
            <ThumbDownIcon />
          </IconButton>
        ) : (
          <IconButton
          // onClick={(post_id) =>
          //   handleDislikePost(props.post.post_id, post_id)
          // }
          >
            <ThumbDownOutlinedIcon />
          </IconButton>
        )}

        <IconButton>
          <ChatBubbleOutlineIcon />
          <Typography>Reply</Typography>
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default CommentCard;
