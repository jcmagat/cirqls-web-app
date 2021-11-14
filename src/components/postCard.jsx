import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import { useMutation } from "@apollo/client";
import { DELETE_POST, LIKE_POST } from "../graphql/mutations";

const useStyles = makeStyles({
  pos: {
    marginBottom: 12,
  },
});

function PostCard(props) {
  const classes = useStyles();

  const [liked, setLiked] = useState(props.post.likedByMe);

  // eslint-disable-next-line
  const [deletePost, { loading, error }] = useMutation(DELETE_POST, {
    onCompleted: props.removePost,
  });

  const handleDeletePost = (post_id) => {
    deletePost({
      variables: {
        post_id: post_id,
      },
    });
  };

  const [likePost] = useMutation(LIKE_POST, {
    onCompleted: () => {
      setLiked(true);
    },
  });

  const handleLikePost = (id) => {
    likePost({
      variables: {
        id: id,
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
        <IconButton onClick={(id) => handleLikePost(props.post.id, id)}>
          {liked ? (
            <FavoriteIcon style={{ fill: "red" }} />
          ) : (
            <FavoriteBorderIcon />
          )}
        </IconButton>
        <Typography variant="subtitle1">{props.post.likes}</Typography>
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
