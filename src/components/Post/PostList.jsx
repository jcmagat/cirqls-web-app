import React from "react";
import Box from "@mui/material/Box";
import PostCard from "./PostCard";

function PostList({ posts }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {posts?.map((post) => (
        <PostCard key={post.post_id} post={post} />
      ))}
    </Box>
  );
}

export default PostList;
