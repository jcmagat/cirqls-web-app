import React, { useState, useEffect } from "react";
import makeStyles from '@mui/styles/makeStyles';
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
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import Popover from "@mui/material/Popover";
import ButtonGroup from "@mui/material/ButtonGroup";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

const useStyles = makeStyles({
  subheader: {
    display: "flex",
    gap: 6,
  },
  media: {
    height: "70vh", // TODO: fix
  },
  mediaRoot: {
    backgroundSize: "contain",
    backgroundPosition: "top",
  },
});

function PostCardContent({ post }) {
  const classes = useStyles();

  if (post.__typename === "TextPost") {
    return (
      <CardContent>
        <Typography variant="h6">{post.title}</Typography>
        <Typography variant="body1">{post.description}</Typography>
      </CardContent>
    );
  } else {
    return (
      <>
        <CardContent>
          <Typography variant="h6">{post.title}</Typography>
        </CardContent>

        <CardMedia
          className={classes.media}
          image={post.media_src}
          alt=""
          classes={{
            root: classes.mediaRoot,
          }}
        />
      </>
    );
  }
}

function PostCard({ post }) {
  const classes = useStyles();

  const authUser = useAuthUser();

  const isAuthUsersPost =
    authUser && authUser.username === post.poster.username;

  /* ========== Like/Dislike Post ========== */

  const authUserReaction = post.reactions.auth_user_reaction;
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
        post_id: post.post_id,
        reaction: "like",
      },
    });
  };

  const handleDislikePost = () => {
    addPostReaction({
      variables: {
        post_id: post.post_id,
        reaction: "dislike",
      },
    });
  };

  const handleDeletePostReaction = () => {
    deletePostReaction({
      variables: {
        post_id: post.post_id,
      },
    });
  };

  /* ========== Save/Unsave Post ========== */

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (
      authUser &&
      authUser.saved_posts.some(
        (saved_post) => saved_post.post_id === post.post_id
      )
    ) {
      setSaved(true);
    } else {
      setSaved(false);
    }
  }, [authUser, post]);

  const [savePost] = useMutation(SAVE_POST, {
    onCompleted: useAuthUserUpdate(),
  });
  const [unsavePost] = useMutation(UNSAVE_POST, {
    onCompleted: useAuthUserUpdate(),
  });

  const handleSavePost = () => {
    savePost({
      variables: {
        post_id: post.post_id,
      },
    });
  };

  const handleUnsavePost = () => {
    unsavePost({
      variables: {
        post_id: post.post_id,
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
        post_id: post.post_id,
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
          <Link href={`/c/${post.community.name}`}>
            <Avatar src={post.community.logo_src} />
          </Link>
        }
        disableTypography
        title={
          <Link href={`/c/${post.community.name}`} color="inherit">
            <Typography variant="subtitle2">{`c/${post.community.name}`}</Typography>
          </Link>
        }
        subheader={
          <Paper className={classes.subheader} elevation={0}>
            <Link href={`/u/${post.poster.username}`} color="inherit">
              <Typography variant="subtitle2">{`u/${post.poster.username}`}</Typography>
            </Link>

            <Typography variant="subtitle2">{`⋅ ${post.created_since}`}</Typography>
          </Paper>
        }
      />

      <PostCardContent post={post} />

      <CardActions disableSpacing>
        {liked ? (
          <IconButton onClick={handleDeletePostReaction} size="large">
            <ThumbUpIcon />
          </IconButton>
        ) : (
          <IconButton onClick={handleLikePost} size="large">
            <ThumbUpOutlinedIcon />
          </IconButton>
        )}

        <Typography variant="subtitle1">{post.reactions.total}</Typography>

        {disliked ? (
          <IconButton onClick={handleDeletePostReaction} size="large">
            <ThumbDownIcon />
          </IconButton>
        ) : (
          <IconButton onClick={handleDislikePost} size="large">
            <ThumbDownOutlinedIcon />
          </IconButton>
        )}

        <Link href={`/post/${post.post_id}`} component={IconButton}>
          <ChatBubbleOutlineIcon />
          <Typography>{`${post.comments_info.total} Comments`}</Typography>
        </Link>

        {saved ? (
          <IconButton onClick={handleUnsavePost} size="large">
            <BookmarkIcon />
            <Typography>Unsave</Typography>
          </IconButton>
        ) : (
          <IconButton onClick={handleSavePost} size="large">
            <BookmarkBorderIcon />
            <Typography>Save</Typography>
          </IconButton>
        )}

        <IconButton onClick={handleMoreMenuOpen} size="large">
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
              <IconButton onClick={handleDeleteButtonClick} size="large">
                <DeleteOutlineIcon />
                <Typography>Delete</Typography>
              </IconButton>
            )}

            <IconButton size="large">
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
