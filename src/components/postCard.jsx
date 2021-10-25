import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { useMutation } from "@apollo/client";
import { DELETE_POST } from "../graphql/mutations";

const useStyles = makeStyles({
  pos: {
    marginBottom: 12,
  },
});

function PostCard(props) {
  const classes = useStyles();

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
      <CardActions>
        <IconButton
          onClick={(id) => handleDeletePost(props.post.id, id)}
          aria-label="delete"
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default PostCard;
