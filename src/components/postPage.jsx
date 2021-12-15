import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import NavBar from "./navBar";
import PostCard from "./postCard";
import CommentForm from "./commentForm";
import CommentTree from "./commentTree";
import { useQuery } from "@apollo/client";
import { GET_POST, GET_COMMENTS } from "../graphql/queries";

const useStyles = makeStyles({
  paper: {
    marginTop: 80,
  },
});

function PostPage(props) {
  const location = useLocation();
  const post_id = parseInt(location.pathname.split("/")[2]);

  const classes = useStyles();

  const [post, setPost] = useState();
  const [comments, setComments] = useState([]);

  const { data: getPostData, refetch: refetchPost } = useQuery(GET_POST, {
    variables: { post_id: post_id },
  });

  const { data: getCommentsData, refetch: refetchComments } = useQuery(
    GET_COMMENTS,
    {
      variables: { post_id: post_id },
    }
  );

  useEffect(() => {
    if (getPostData) {
      setPost(getPostData.post);
    }
  }, [getPostData]);

  useEffect(() => {
    if (getCommentsData) {
      setComments(getCommentsData.comments);
    }
  }, [getCommentsData]);

  // Called in CommentCard when a comment has been liked or disliked
  // Passed to CommentCard from CommentTree
  const handleCommentReactionChange = (data) => {
    refetchComments();
  };

  // Called in PostCard when the post has been liked or disliked
  const handlePostReactionChange = (data) => {
    refetchPost();
  };

  // Called in CommentForm when a comment has been added
  // Also passed to CommentForm from CommentTree
  const finishAddComment = (data) => {
    refetchPost();
    refetchComments();
  };

  return (
    <Container component="main">
      <NavBar />

      {post && (
        <Paper className={classes.paper} elevation={0}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <PostCard
                post={post}
                handlePostReactionChange={handlePostReactionChange}
              />
            </Grid>

            <Grid item>
              <CommentForm
                open={true}
                isReply={false}
                parent_comment_id={null}
                post_id={post.post_id}
                finishAddComment={finishAddComment}
              />
            </Grid>

            <Grid item>
              <CommentTree
                comments={comments}
                comment_ids={post.comments_info.comment_ids}
                handleCommentReactionChange={handleCommentReactionChange}
                finishAddComment={finishAddComment}
              />
            </Grid>
          </Grid>
        </Paper>
      )}
    </Container>
  );
}

export default PostPage;
