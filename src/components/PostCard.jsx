import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ThumbUpOutlinedIcon from "@material-ui/icons/ThumbUpOutlined";
import ThumbDownOutlinedIcon from "@material-ui/icons/ThumbDownOutlined";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import DeleteIcon from "@material-ui/icons/Delete";
import FlagIcon from "@material-ui/icons/Flag";
import Popover from "@material-ui/core/Popover";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import {
  DELETE_POST,
  ADD_POST_REACTION,
  DELETE_POST_REACTION,
} from "../graphql/mutations";
import { GET_POSTS } from "../graphql/queries";

const useStyles = makeStyles({
  pos: {
    marginBottom: 12,
  },
});

function PostCard(props) {
  const classes = useStyles();

  const isAuthUsersPost =
    parseInt(localStorage.getItem("user_id")) === props.post.user_id;

  const authUserReaction = props.post.reactions.auth_user_reaction;
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const [moreMenuAnchor, setMoreMenuAnchor] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

  const [deletePost, { loading: deletePostLoading }] = useMutation(
    DELETE_POST,
    {
      refetchQueries: [GET_POSTS],
    }
  );

  const [addPostReaction] = useMutation(ADD_POST_REACTION);

  const [deletePostReaction] = useMutation(DELETE_POST_REACTION);

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

  const handleDeletePostReaction = (post_id) => {
    deletePostReaction({
      variables: {
        post_id: post_id,
      },
    });
  };

  const handleDeletePost = (post_id) => {
    handleDeleteDialogClose();

    deletePost({
      variables: {
        post_id: post_id,
      },
    });
  };

  const handleMoreMenuOpen = (event) => {
    setMoreMenuAnchor(event.currentTarget);
  };

  const handleMoreMenuClose = () => {
    setMoreMenuAnchor(null);
  };

  const handleDeleteButtonClick = () => {
    handleMoreMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const disableIfLoading = (loading) => {
    return {
      opacity: loading ? 0.25 : 1,
      pointerEvents: loading ? "none" : "initial",
    };
  };

  return (
    <Card style={disableIfLoading(deletePostLoading)}>
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
        {liked ? (
          <IconButton
            onClick={(post_id) =>
              handleDeletePostReaction(props.post.post_id, post_id)
            }
          >
            <ThumbUpIcon />
          </IconButton>
        ) : (
          <IconButton
            onClick={(post_id) => handleLikePost(props.post.post_id, post_id)}
          >
            <ThumbUpOutlinedIcon />
          </IconButton>
        )}

        <Typography variant="subtitle1">
          {props.post.reactions.total}
        </Typography>

        {disliked ? (
          <IconButton
            onClick={(post_id) =>
              handleDeletePostReaction(props.post.post_id, post_id)
            }
          >
            <ThumbDownIcon />
          </IconButton>
        ) : (
          <IconButton
            onClick={(post_id) =>
              handleDislikePost(props.post.post_id, post_id)
            }
          >
            <ThumbDownOutlinedIcon />
          </IconButton>
        )}

        <IconButton component={Link} to={`/post/${props.post.post_id}`}>
          <ChatBubbleOutlineIcon />
          <Typography>{`${props.post.comments_info.total} Comments`}</Typography>
        </IconButton>

        <IconButton onClick={handleMoreMenuOpen}>
          <MoreHorizIcon />
        </IconButton>
        <Popover
          open={Boolean(moreMenuAnchor)}
          anchorEl={moreMenuAnchor}
          onClose={handleMoreMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <ButtonGroup orientation="vertical">
            {isAuthUsersPost && (
              <IconButton onClick={handleDeleteButtonClick}>
                <DeleteIcon />
                <Typography>Delete</Typography>
              </IconButton>
            )}

            <IconButton>
              <FlagIcon />
              <Typography>Report</Typography>
            </IconButton>
          </ButtonGroup>
        </Popover>

        <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
          <DialogTitle>Delete post</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this post?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              variant="outlined"
              onClick={handleDeleteDialogClose}
            >
              Keep
            </Button>
            <Button
              color="secondary"
              variant="contained"
              onClick={(post_id) =>
                handleDeletePost(props.post.post_id, post_id)
              }
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </CardActions>
    </Card>
  );
}

export default PostCard;
