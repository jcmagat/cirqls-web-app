import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import PostCard from "./postCard";
import PostDialog from "./postDialog";
import NavBar from "./navBar";

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

  const [posts, getPosts] = useState([]);

  useEffect(() => {
    getAllPosts();
  }, []);

  const getAllPosts = () => {
    axios.get("http://localhost:5000/api/v1/posts").then((response) => {
      const allPosts = response.data.data;
      getPosts(allPosts);
    });
  };

  const deletePost = (id) => {
    axios
      .delete(`http://localhost:5000/api/v1/posts/${id}`)
      .then((response) => {
        if (response.status === 200) {
          getPosts(posts.filter((post) => post._id !== id));
        }
      });
  };

  const addPost = (message) => {
    const post = {
      message: message,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    axios
      .post("http://localhost:5000/api/v1/posts", post, config)
      .then((response) => {
        if (response.status === 200) {
          getAllPosts();
        }
      });
  };

  return (
    <div>
      <NavBar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <Grid className={classes.postGrid} container spacing={4}>
        {posts.map((post) => (
          <Grid item key={post._id}>
            <PostCard post={post} deletePost={deletePost} />
          </Grid>
        ))}
      </Grid>
      {isLoggedIn ? <PostDialog addPost={addPost} /> : <></>}
    </div>
  );
}

export default HomePage;
