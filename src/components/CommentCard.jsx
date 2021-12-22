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
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import Typography from "@material-ui/core/Typography";
import CommentForm from "./CommentForm";
import { useMutation } from "@apollo/client";
import {
  DELETE_COMMENT,
  ADD_COMMENT_REACTION,
  DELETE_COMMENT_REACTION,
} from "../graphql/mutations";
import { Paper } from "@material-ui/core";
import { GET_POST, GET_COMMENTS } from "../graphql/queries";

const useStyles = makeStyles({
  comment: {
    position: "relative",
    top: -16,
    // boxShadow: "none",
  },
  replyForm: {
    marginLeft: 16,
  },
});

function CommentCard(props) {
  const classes = useStyles();

  const isAuthUsersComment =
    parseInt(localStorage.getItem("user_id")) === props.comment.user_id;

  const authUserReaction = props.comment.reactions.auth_user_reaction;
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const [replyFormOpen, setReplyFormOpen] = useState(false);

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

  const [deleteComment] = useMutation(DELETE_COMMENT, {
    refetchQueries: [
      { query: GET_POST, variables: { post_id: props.comment.post_id } },
      { query: GET_COMMENTS, variables: { post_id: props.comment.post_id } },
    ],
  });

  const [addCommentReaction] = useMutation(ADD_COMMENT_REACTION);

  const [deleteCommentReaction] = useMutation(DELETE_COMMENT_REACTION);

  const handleDeleteComment = (comment_id) => {
    deleteComment({
      variables: {
        comment_id: comment_id,
      },
    });
  };

  const handleLikeComment = (comment_id) => {
    addCommentReaction({
      variables: {
        comment_id: comment_id,
        reaction: "like",
      },
    });
  };

  const handleDislikeComment = (comment_id) => {
    addCommentReaction({
      variables: {
        comment_id: comment_id,
        reaction: "dislike",
      },
    });
  };

  const handleDeleteCommentReaction = (comment_id) => {
    deleteCommentReaction({
      variables: {
        comment_id: comment_id,
      },
    });
  };

  const handleReplyButtonClick = () => {
    setReplyFormOpen(true);
  };

  const handleReplyFormClose = () => {
    setReplyFormOpen(false);
  };

  return (
    <Paper elevation={0}>
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
              onClick={(comment_id) =>
                handleDeleteCommentReaction(
                  props.comment.comment_id,
                  comment_id
                )
              }
            >
              <ThumbUpIcon />
            </IconButton>
          ) : (
            <IconButton
              onClick={(comment_id) =>
                handleLikeComment(props.comment.comment_id, comment_id)
              }
            >
              <ThumbUpOutlinedIcon />
            </IconButton>
          )}

          <Typography variant="subtitle1">
            {props.comment.reactions.total}
          </Typography>

          {disliked ? (
            <IconButton
              onClick={(comment_id) =>
                handleDeleteCommentReaction(
                  props.comment.comment_id,
                  comment_id
                )
              }
            >
              <ThumbDownIcon />
            </IconButton>
          ) : (
            <IconButton
              onClick={(comment_id) =>
                handleDislikeComment(props.comment.comment_id, comment_id)
              }
            >
              <ThumbDownOutlinedIcon />
            </IconButton>
          )}

          <IconButton onClick={handleReplyButtonClick}>
            <ChatBubbleOutlineIcon />
            <Typography>Reply</Typography>
          </IconButton>

          {isAuthUsersComment && (
            <IconButton
              onClick={(comment_id) =>
                handleDeleteComment(props.comment.comment_id, comment_id)
              }
            >
              <DeleteOutlinedIcon />
              <Typography>Delete</Typography>
            </IconButton>
          )}
        </CardActions>
      </Card>

      <Paper className={classes.replyForm} elevation={0}>
        <CommentForm
          open={replyFormOpen}
          showCancelButton={true}
          onCancel={handleReplyFormClose}
          onSubmit={handleReplyFormClose}
          parent_comment_id={props.comment.comment_id}
          post_id={props.comment.post_id}
          comment={props.comment}
        />
      </Paper>
    </Paper>
  );
}

export default CommentCard;
