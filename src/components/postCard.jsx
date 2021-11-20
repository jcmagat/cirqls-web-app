import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import ThumbUpOutlinedIcon from "@material-ui/icons/ThumbUpOutlined";
import ThumbDownOutlinedIcon from "@material-ui/icons/ThumbDownOutlined";
import { useMutation } from "@apollo/client";
import { DELETE_POST, ADD_POST_REACTION } from "../graphql/mutations";

const useStyles = makeStyles({
  pos: {
    marginBottom: 12,
  },
});

function PostCard(props) {
  const classes = useStyles();

  // eslint-disable-next-line
  const [deletePost, { loading, error }] = useMutation(DELETE_POST, {
    onCompleted: props.removePost,
  });

  const [addPostReaction] = useMutation(ADD_POST_REACTION, {
    onCompleted: props.handleAddPostReaction,
  });

  const handleDeletePost = (post_id) => {
    deletePost({
      variables: {
        post_id: post_id,
      },
    });
  };

  const handleLikePost = (post_id) => {
    addPostReaction({
      variables: {
        post_id: post_id,
        reaction: "like",
      },
    });
  };

  const handleDislikePost = (post_id) => {
    addPostReaction({
      variables: {
        post_id: post_id,
        reaction: "dislike",
      },
    });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{props.post.title}</Typography>
        <Typography
          className={classes.pos}
          variant="subtitle2"
          color="textSecondary"
        >
          posted {props.post.created_since} by {props.post.username}
        </Typography>
        <Typography variant="body1">{props.post.description}</Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          onClick={(post_id) => handleLikePost(props.post.post_id, post_id)}
        >
          <ThumbUpOutlinedIcon />
        </IconButton>
        <Typography variant="subtitle1">
          {props.post.reactions.total}
        </Typography>
        <IconButton
          onClick={(post_id) => handleDislikePost(props.post.post_id, post_id)}
        >
          <ThumbDownOutlinedIcon />
        </IconButton>
        <IconButton
          onClick={(post_id) => handleDeletePost(props.post.post_id, post_id)}
          aria-label="delete"
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default PostCard;
