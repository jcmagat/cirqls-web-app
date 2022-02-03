import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useAuthUser } from "../../context/AuthUserContext";
import { useMutation } from "@apollo/client";
import {
  DELETE_COMMENT,
  ADD_COMMENT_REACTION,
  DELETE_COMMENT_REACTION,
  ADD_COMMENT,
} from "../../graphql/mutations";
import { GET_POST, GET_COMMENTS } from "../../graphql/queries";
import { COMMENT_FRAGMENT } from "../../graphql/fragments";
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import ThumbUpOutlinedIcon from "@material-ui/icons/ThumbUpOutlined";
import ThumbDownOutlinedIcon from "@material-ui/icons/ThumbDownOutlined";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import Typography from "@material-ui/core/Typography";
import CommentForm from "./CommentForm";
import { Link } from "react-router-dom";

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

  const authUser = useAuthUser();

  const isAuthUsersComment =
    authUser && authUser.username === props.comment.username;

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

  const [addCommentReply] = useMutation(ADD_COMMENT, {
    onCompleted: handleReplyFormClose,
    refetchQueries: [
      { query: GET_POST, variables: { post_id: props.comment.post_id } },
    ],
    update(cache, { data: { addComment } }) {
      cache.modify({
        id: cache.identify(props.comment),
        fields: {
          child_comments(existingCommentRefs = []) {
            const newCommentRef = cache.writeFragment({
              data: addComment,
              fragment: COMMENT_FRAGMENT,
            });

            return [newCommentRef, ...existingCommentRefs];
          },
        },
      });
    },
  });

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

  const handleAddCommentReply = (message) => {
    addCommentReply({
      variables: {
        parent_comment_id: props.comment.comment_id,
        post_id: props.comment.post_id,
        message: message,
      },
    });
  };

  const handleReplyButtonClick = () => {
    setReplyFormOpen(true);
  };

  function handleReplyFormClose() {
    setReplyFormOpen(false);
  }

  return (
    <Paper elevation={0}>
      <Card className={classes.comment}>
        <CardHeader
          avatar={
            <Avatar component={Link} to={`/u/${props.comment.username}`}>
              {props.comment.username.charAt(0).toUpperCase()}
            </Avatar>
          }
          disableTypography
          title={
            <Typography
              variant="subtitle2"
              component={Link}
              to={`/u/${props.comment.username}`}
            >
              {`u/${props.comment.username}`}
            </Typography>
          }
          subheader={
            <Typography variant="subtitle2">
              {props.comment.created_since}
            </Typography>
          }
        />

        <CardContent>
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
          autoFocus={true}
          showCancelButton={true}
          onCancel={handleReplyFormClose}
          onSubmit={handleAddCommentReply}
        />
      </Paper>
    </Paper>
  );
}

export default CommentCard;
