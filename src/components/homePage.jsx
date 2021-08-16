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

  const addPost = (data) => {
    const post = {
      postedBy: data.name,
      message: data.message,
    };

    axios.post("http://localhost:5000/api/v1/posts", post).then((response) => {
      if (response.status === 200) {
        getAllPosts();
      }
    });
  };

  return (
    <div>
      <NavBar />
      <Grid className={classes.postGrid} container spacing={4}>
        {posts.map((post) => (
          <Grid item key={post._id}>
            <PostCard post={post} deletePost={deletePost} />
          </Grid>
        ))}
      </Grid>
      <PostDialog addPost={addPost} />
    </div>
  );
}

export default HomePage;
