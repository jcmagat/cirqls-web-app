import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import PostCard from "./components/postCard";

function App() {
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

  return (
    <div>
      <Grid container spacing={4}>
        {posts.map((post) => (
          <Grid item key={post._id}>
            <PostCard post={post} deletePost={deletePost} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default App;
