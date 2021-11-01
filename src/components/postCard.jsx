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
import { DELETE_POST } from "../graphql/mutations";

const useStyles = makeStyles({
  pos: {
    marginBottom: 12,
  },
});

function PostCard(props) {
  const classes = useStyles();

  const user = localStorage.getItem("user");
  const canDelete = user === props.post.postedBy;

  const [liked, setLiked] = useState(false);

  // eslint-disable-next-line
  const [deletePost, { loading, error }] = useMutation(DELETE_POST, {
    onCompleted: props.removePost,
  });

  const handleDeletePost = (id) => {
    deletePost({
      variables: {
        id: id,
      },
    });
  };

  const handleLikePost = () => {
    setLiked(!liked);
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
          posted {props.post.postedSince} by {props.post.postedBy}
        </Typography>
        <Typography variant="body1">{props.post.message}</Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton onClick={handleLikePost}>
          {liked ? (
            <FavoriteIcon style={{ fill: "red" }} />
          ) : (
            <FavoriteBorderIcon />
          )}
        </IconButton>
        <Typography variant="subtitle1">{props.post.likes}</Typography>
        {canDelete ? (
          <IconButton
            onClick={(id) => handleDeletePost(props.post.id, id)}
            aria-label="delete"
          >
            <DeleteIcon />
          </IconButton>
        ) : (
          <></>
        )}
      </CardActions>
    </Card>
  );
}

export default PostCard;
