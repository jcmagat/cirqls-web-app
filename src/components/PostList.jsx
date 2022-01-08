import React from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import PostCard from "../components/PostCard";

function PostList(props) {
  return (
    <Paper elevation={0}>
      {props.posts && (
        <Grid container spacing={2} direction="column-reverse">
          {props.posts.map((post) => (
            <Grid item key={post.post_id}>
              <PostCard post={post} />
            </Grid>
          ))}
        </Grid>
      )}
    </Paper>
  );
}

export default PostList;
