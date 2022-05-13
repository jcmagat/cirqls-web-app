import React, { useState, useEffect } from "react";
import { useAuthUser } from "../../context/AuthUserContext";
import { useMutation } from "@apollo/client";
import {
  DELETE_COMMENT,
  ADD_COMMENT_REACTION,
  DELETE_COMMENT_REACTION,
  ADD_COMMENT,
} from "../../graphql/mutations";
import { GET_POST, GET_POST_COMMENTS } from "../../graphql/queries";
import { COMMENT_FRAGMENT } from "../../graphql/fragments";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import Typography from "@mui/material/Typography";
import StyledMenuItem from "../Common/StyledMenuItem";
import CommentForm from "./CommentForm";

function CommentCard({ comment, elevation }) {
  const authUser = useAuthUser();

  const isAuthUsersComment =
    authUser && authUser.username === comment.commenter.username;

  const authUserReaction = comment.reactions.auth_user_reaction;
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const [replyFormOpen, setReplyFormOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState();

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
      { query: GET_POST_COMMENTS, variables: { post_id: comment.post_id } },
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
    <>
      <Card elevation={Number.isInteger(elevation) ? elevation : 1}>
        <CardHeader
          avatar={
            <Avatar
              src={comment.commenter.profile_pic_src}
              component={Link}
              href={`/u/${comment.commenter.username}`}
            />
          }
          disableTypography
          title={
            <Typography
              variant="subtitle2"
              component={Link}
              href={`/u/${comment.commenter.username}`}
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
              <ThumbUpIcon color="primary" />
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
              <ThumbDownIcon color="secondary" />
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
            <Typography sx={{ marginLeft: 1 }}>Reply</Typography>
          </IconButton>

          <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
            <MoreHorizIcon />
          </IconButton>

          <Menu
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
          >
            {isAuthUsersComment && (
              <StyledMenuItem
                onClick={(comment_id) =>
                  handleDeleteComment(comment.comment_id, comment_id)
                }
              >
                <DeleteOutlinedIcon />
                Delete
              </StyledMenuItem>
            )}

            <StyledMenuItem>
              <FlagOutlinedIcon />
              Report
            </StyledMenuItem>
          </Menu>
        </CardActions>
      </Card>

      <CommentForm
        open={replyFormOpen}
        autoFocus={true}
        showCancelButton={true}
        onCancel={handleReplyFormClose}
        onSubmit={handleAddCommentReply}
        sx={{ marginTop: 2, marginLeft: 3.5 }}
      />
    </>
  );
}

export default CommentCard;
