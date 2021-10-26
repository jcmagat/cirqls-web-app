import React from "react";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import PostCard from "./postCard";
import PostDialog from "./postDialog";
import NavBar from "./navBar";
import { useQuery } from "@apollo/client";
import { GET_POSTS } from "../graphql/queries";

const useStyles = makeStyles({
  postGrid: {
    margin: 16,
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
    <div>
      <NavBar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <Grid className={classes.postGrid} container spacing={4}>
        {posts.map((post) => (
          <Grid item key={post.id}>
            <PostCard post={post} removePost={removePost} />
          </Grid>
        ))}
      </Grid>
      {isLoggedIn ? <PostDialog displayPost={displayPost} /> : <></>}
    </div>
  );
}

export default HomePage;
