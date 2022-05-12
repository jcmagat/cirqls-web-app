import React, { useState, useEffect } from "react";
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
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import Typography from "@mui/material/Typography";
import CommentForm from "./CommentForm";
import { Link } from "react-router-dom";

function CommentCard({ comment, elevation }) {
  const authUser = useAuthUser();

  const isAuthUsersComment =
    authUser && authUser.username === comment.commenter.username;

  const authUserReaction = comment.reactions.auth_user_reaction;
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
      { query: GET_POST, variables: { post_id: comment.post_id } },
      { query: GET_COMMENTS, variables: { post_id: comment.post_id } },
    ],
  });

  const [addCommentReaction] = useMutation(ADD_COMMENT_REACTION);

  const [deleteCommentReaction] = useMutation(DELETE_COMMENT_REACTION);

  const [addCommentReply] = useMutation(ADD_COMMENT, {
    onCompleted: handleReplyFormClose,
    refetchQueries: [
      { query: GET_POST, variables: { post_id: comment.post_id } },
    ],
    update(cache, { data: { addComment } }) {
      cache.modify({
        id: cache.identify(comment),
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
        parent_comment_id: comment.comment_id,
        post_id: comment.post_id,
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
    <Box>
      <Card elevation={elevation}>
        <CardHeader
          avatar={
            <Avatar
              src={comment.commenter.profile_pic_src}
              component={Link}
              to={`/u/${comment.commenter.username}`}
            />
          }
          disableTypography
          title={
            <Typography
              variant="subtitle2"
              component={Link}
              to={`/u/${comment.commenter.username}`}
            >
              {`u/${comment.commenter.username}`}
            </Typography>
          }
          subheader={
            <Typography variant="subtitle2">{comment.created_since}</Typography>
          }
        />

        <CardContent>
          <Typography variant="body1">{comment.message}</Typography>
        </CardContent>

        <CardActions disableSpacing>
          {liked ? (
            <IconButton
              onClick={(comment_id) =>
                handleDeleteCommentReaction(comment.comment_id, comment_id)
              }
            >
              <ThumbUpIcon />
            </IconButton>
          ) : (
            <IconButton
              onClick={(comment_id) =>
                handleLikeComment(comment.comment_id, comment_id)
              }
            >
              <ThumbUpOutlinedIcon />
            </IconButton>
          )}

          <Typography variant="subtitle1">{comment.reactions.total}</Typography>

          {disliked ? (
            <IconButton
              onClick={(comment_id) =>
                handleDeleteCommentReaction(comment.comment_id, comment_id)
              }
            >
              <ThumbDownIcon />
            </IconButton>
          ) : (
            <IconButton
              onClick={(comment_id) =>
                handleDislikeComment(comment.comment_id, comment_id)
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
                handleDeleteComment(comment.comment_id, comment_id)
              }
            >
              <DeleteOutlinedIcon />
              <Typography>Delete</Typography>
            </IconButton>
          )}
        </CardActions>
      </Card>

      <Box sx={{ marginTop: 2, marginLeft: 2 }}>
        <CommentForm
          open={replyFormOpen}
          autoFocus={true}
          showCancelButton={true}
          onCancel={handleReplyFormClose}
          onSubmit={handleAddCommentReply}
        />
      </Box>
    </Box>
  );
}

export default CommentCard;
