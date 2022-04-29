import React, { useState, useEffect } from "react";
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
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Zoom from "@mui/material/Zoom";
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

function PostCardContent({ post }) {
  const [open, setOpen] = useState(false);

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
          component="img"
          image={post.media_src}
          alt={post.title}
          sx={{
            maxHeight: "60vh",
            objectPosition: "top",
          }}
          onClick={() => setOpen(true)}
        />

        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          TransitionComponent={Zoom}
          fullWidth
          maxWidth="xl"
          PaperProps={{
            sx: {
              // maxHeight: "95vh",
            },
          }}
        >
          <img
            src={post.media_src}
            alt={post.title}
            style={{ objectFit: "contain" }}
          />
        </Dialog>
      </>
    );
  }
}

function PostCard({ post }) {
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
          <Avatar
            src={post.community.logo_src}
            component={Link}
            href={`/c/${post.community.name}`}
          />
        }
        disableTypography
        title={
          <Typography
            variant="subtitle2"
            component={Link}
            href={`/c/${post.community.name}`}
          >{`c/${post.community.name}`}</Typography>
        }
        subheader={
          <Box sx={{ display: "flex", gap: 1 }}>
            <Typography
              variant="subtitle2"
              component={Link}
              href={`/u/${post.poster.username}`}
            >{`u/${post.poster.username}`}</Typography>
            <Typography variant="subtitle2">⋅</Typography>
            <Typography variant="subtitle2">{post.created_since}</Typography>
          </Box>
        }
      />

      <PostCardContent post={post} />

      <CardActions disableSpacing>
        {liked ? (
          <IconButton onClick={handleDeletePostReaction}>
            <ThumbUpIcon color="primary" />
          </IconButton>
        ) : (
          <IconButton onClick={handleLikePost}>
            <ThumbUpOutlinedIcon />
          </IconButton>
        )}

        <Typography variant="subtitle1">{post.reactions.total}</Typography>

        {disliked ? (
          <IconButton onClick={handleDeletePostReaction}>
            <ThumbDownIcon color="secondary" />
          </IconButton>
        ) : (
          <IconButton onClick={handleDislikePost}>
            <ThumbDownOutlinedIcon />
          </IconButton>
        )}

        <IconButton component={Link} href={`/post/${post.post_id}`}>
          <ChatBubbleOutlineIcon />
          <Typography>{`${post.comments_info.total} Comments`}</Typography>
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
