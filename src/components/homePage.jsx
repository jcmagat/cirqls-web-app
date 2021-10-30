import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import PostCard from "./postCard";
import PostDialog from "./postDialog";
import NavBar from "./navBar";
import { useQuery } from "@apollo/client";
import { GET_POSTS } from "../graphql/queries";

const useStyles = makeStyles({
  postGrid: {
    marginTop: 8,
  },
});

function HomePage(props) {
  const classes = useStyles();

  const [isLoggedIn, setIsLoggedIn] = useState(
    !(localStorage.getItem("token") == null)
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const [posts, setPosts] = useState([]);

  // eslint-disable-next-line
  const { loading, error, data } = useQuery(GET_POSTS);

  useEffect(() => {
    if (data) {
      setPosts(data.posts);
    }
  }, [data]);

  const displayPost = (data) => {
    const addedPost = data.addPost;
    setPosts([...posts, addedPost]);
  };

  const removePost = (data) => {
    const deletedPost = data.deletePost;
    setPosts(posts.filter((post) => post.id !== deletedPost.id));
  };

  return (
    <Paper component="div" elevation={0}>
      <NavBar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <Container>
        <Grid
          className={classes.postGrid}
          container
          spacing={2}
          direction="column-reverse"
        >
          {posts.map((post) => (
            <Grid item key={post.id}>
              <PostCard post={post} removePost={removePost} />
            </Grid>
          ))}
        </Grid>
      </Container>
      {isLoggedIn ? <PostDialog displayPost={displayPost} /> : <></>}
    </Paper>
  );
}

export default HomePage;
