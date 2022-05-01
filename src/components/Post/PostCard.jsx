import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
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
import CloseIcon from "@mui/icons-material/Close";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

const StyledCardActions = styled(CardActions)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    justifyContent: "space-between",
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  gap: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

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
            cursor: "pointer",
          }}
          onClick={() => setOpen(true)}
        />

        <Dialog
          open={open}
          fullScreen
          onClick={() => setOpen(false)}
          PaperProps={{
            sx: {
              background: "rgba(0, 0, 0, 0.5)",
            },
          }}
        >
          <CloseIcon
            sx={{
              color: "white",
              cursor: "pointer",
              position: "fixed",
              top: 0,
              right: 0,
              padding: 2,
            }}
          />

          <img
            src={post.media_src}
            alt={post.title}
            onClick={(event) => {
              // Prevent closing the dialog when image is clicked
              // Only close when background is clicked
              event.stopPropagation();
            }}
            style={{
              maxHeight: "85vh",
              maxWidth: "100vw",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
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

      <StyledCardActions disableSpacing>
        <Box
          sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        >
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
        </Box>

        <IconButton component={Link} href={`/post/${post.post_id}`}>
          <ChatBubbleOutlineIcon />
          <Typography
            sx={{ marginLeft: 1 }}
          >{`${post.comments_info.total} Comments`}</Typography>
        </IconButton>

        <IconButton onClick={handleMoreMenuOpen}>
          <MoreHorizIcon />
        </IconButton>

        <Menu
          open={Boolean(moreMenuAnchor)}
          anchorEl={moreMenuAnchor}
          onClose={handleMoreMenuClose}
        >
          {!!authUser && (
            <Box>
              {saved ? (
                <StyledMenuItem onClick={handleUnsavePost}>
                  <BookmarkIcon />
                  Unsave
                </StyledMenuItem>
              ) : (
                <StyledMenuItem onClick={handleSavePost}>
                  <BookmarkBorderIcon />
                  Save
                </StyledMenuItem>
              )}
            </Box>
          )}

          {isAuthUsersPost && (
            <StyledMenuItem onClick={handleDeleteButtonClick}>
              <DeleteOutlineIcon />
              Delete
            </StyledMenuItem>
          )}

          <StyledMenuItem>
            <FlagOutlinedIcon />
            Report
          </StyledMenuItem>
        </Menu>

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
      </StyledCardActions>
    </Card>
  );
}

export default PostCard;
