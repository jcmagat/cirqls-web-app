import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useAuthUser, useAuthUserUpdate } from "../../context/AuthUserContext";
import { useMutation } from "@apollo/client";
import {
  DELETE_POST,
  ADD_POST_REACTION,
  DELETE_POST_REACTION,
  SAVE_POST,
  UNSAVE_POST,
} from "../../graphql/mutations";
import { GET_HOME_PAGE_POSTS } from "../../graphql/queries";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ThumbUpOutlinedIcon from "@material-ui/icons/ThumbUpOutlined";
import ThumbDownOutlinedIcon from "@material-ui/icons/ThumbDownOutlined";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import FlagOutlinedIcon from "@material-ui/icons/FlagOutlined";
import Popover from "@material-ui/core/Popover";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  subheader: {
    display: "flex",
    gap: 6,
  },
});

function PostCard(props) {
  const classes = useStyles();

  const authUser = useAuthUser();

  const isAuthUsersPost =
    authUser && authUser.username === props.post.poster.username;

  /* ========== Like/Dislike Post ========== */

  const authUserReaction = props.post.reactions.auth_user_reaction;
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

  const [addPostReaction] = useMutation(ADD_POST_REACTION);
  const [deletePostReaction] = useMutation(DELETE_POST_REACTION);

  const handleLikePost = () => {
    addPostReaction({
      variables: {
        post_id: props.post.post_id,
        reaction: "like",
      },
    });
  };

  const handleDislikePost = () => {
    addPostReaction({
      variables: {
        post_id: props.post.post_id,
        reaction: "dislike",
      },
    });
  };

  const handleDeletePostReaction = () => {
    deletePostReaction({
      variables: {
        post_id: props.post.post_id,
      },
    });
  };

  /* ========== Save/Unsave Post ========== */

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (
      authUser &&
      authUser.saved_posts.some((post) => post.post_id === props.post.post_id)
    ) {
      setSaved(true);
    } else {
      setSaved(false);
    }
  }, [authUser, props.post]);

  const [savePost] = useMutation(SAVE_POST, {
    onCompleted: useAuthUserUpdate(),
  });
  const [unsavePost] = useMutation(UNSAVE_POST, {
    onCompleted: useAuthUserUpdate(),
  });

  const handleSavePost = () => {
    savePost({
      variables: {
        post_id: props.post.post_id,
      },
    });
  };

  const handleUnsavePost = () => {
    unsavePost({
      variables: {
        post_id: props.post.post_id,
      },
    });
  };

  /* ========== Delete Post ========== */

  // TODO: change refetch queries depending on what page the post is displayed
  const [deletePost, { loading: deletePostLoading }] = useMutation(
    DELETE_POST,
    {
      refetchQueries: [GET_HOME_PAGE_POSTS],
    }
  );

  const handleDeletePost = () => {
    handleDeleteDialogClose();

    deletePost({
      variables: {
        post_id: props.post.post_id,
      },
    });
  };

  /* ========== More Menu, Delete Dialog, Etc. ========== */

  const [moreMenuAnchor, setMoreMenuAnchor] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
      <CardHeader
        avatar={
          <Avatar
            component={Link}
            to={`/c/${props.post.community.name}`}
            src={props.post.community.logo_src}
          />
        }
        disableTypography
        title={
          <Typography
            variant="subtitle2"
            component={Link}
            to={`/c/${props.post.community.name}`}
          >{`c/${props.post.community.name}`}</Typography>
        }
        subheader={
          <Paper className={classes.subheader} elevation={0}>
            <Typography
              variant="subtitle2"
              component={Link}
              to={`/u/${props.post.poster.username}`}
            >{`u/${props.post.poster.username}`}</Typography>
            <Typography variant="subtitle2">{`⋅ ${props.post.created_since}`}</Typography>
          </Paper>
        }
      />

      <CardContent>
        <Typography variant="h6">{props.post.title}</Typography>
        <Typography variant="body1">{props.post.description}</Typography>
        <img src={props.post.media_src} alt="" />
      </CardContent>

      <CardActions disableSpacing>
        {liked ? (
          <IconButton onClick={handleDeletePostReaction}>
            <ThumbUpIcon />
          </IconButton>
        ) : (
          <IconButton onClick={handleLikePost}>
            <ThumbUpOutlinedIcon />
          </IconButton>
        )}

        <Typography variant="subtitle1">
          {props.post.reactions.total}
        </Typography>

        {disliked ? (
          <IconButton onClick={handleDeletePostReaction}>
            <ThumbDownIcon />
          </IconButton>
        ) : (
          <IconButton onClick={handleDislikePost}>
            <ThumbDownOutlinedIcon />
          </IconButton>
        )}

        <IconButton component={Link} to={`/post/${props.post.post_id}`}>
          <ChatBubbleOutlineIcon />
          <Typography>{`${props.post.comments_info.total} Comments`}</Typography>
        </IconButton>

        {saved ? (
          <IconButton onClick={handleUnsavePost}>
            <BookmarkIcon />
            <Typography>Unsave</Typography>
          </IconButton>
        ) : (
          <IconButton onClick={handleSavePost}>
            <BookmarkBorderIcon />
            <Typography>Save</Typography>
          </IconButton>
        )}

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
                <DeleteOutlineIcon />
                <Typography>Delete</Typography>
              </IconButton>
            )}

            <IconButton>
              <FlagOutlinedIcon />
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
              onClick={handleDeletePost}
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
