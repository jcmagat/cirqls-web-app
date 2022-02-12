import React from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import PostCard from "./PostCard";

function PostList({ posts }) {
  return (
    <Paper elevation={0}>
      <Grid container spacing={2} direction="column">
        {posts?.map((post) => (
          <Grid item key={post.post_id}>
            <PostCard post={post} />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

export default PostList;
