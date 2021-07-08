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
      console.log(allPosts);
      getPosts(allPosts);
    });
  };

  return (
    <div>
      <Grid container spacing={4}>
        {posts.map((post) => (
          <Grid item>
            <PostCard key={post._id} post={post} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default App;
