import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import PostCard from "../components/PostCard";
import NavBar from "../components/NavBar";
import { useQuery } from "@apollo/client";
import { GET_POSTS } from "../graphql/queries";

const useStyles = makeStyles({
  postCards: {
    marginTop: 80,
  },
});

function HomePage(props) {
  const classes = useStyles();

  const [posts, setPosts] = useState([]);

  // eslint-disable-next-line
  const { loading, error, data, refetch } = useQuery(GET_POSTS);

  useEffect(() => {
    if (data) {
      setPosts(data.posts);
    }
  }, [data]);

  // Called in postCard when a post has been deleted
  const removePost = (data) => {
    const deletedPost = data.deletePost;
    setPosts(posts.filter((post) => post.post_id !== deletedPost.post_id));
  };

  // Called in postCard when a post has been liked or disliked
  const handlePostReactionChange = (data) => {
    refetch();
  };

  return (
    <Paper elevation={0}>
      <NavBar />
      <Container className={classes.postCards}>
        <Grid container spacing={2} direction="column-reverse">
          {posts.map((post) => (
            <Grid item key={post.post_id}>
              <PostCard
                post={post}
                removePost={removePost}
                handlePostReactionChange={handlePostReactionChange}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Paper>
  );
}

export default HomePage;
