import Box from "@mui/material/Box";
import PostCard from "./PostCard";
import PostCardSkeleton from "./PostCardSkeleton";

function PostList(props) {
  const { posts, loading } = props;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {loading ? (
        <>
          {[1, 2].map((key) => (
            <PostCardSkeleton key={key} />
          ))}
        </>
      ) : (
        <>
          {posts?.map((post) => (
            <PostCard key={post.post_id} post={post} />
          ))}
        </>
      )}
    </Box>
  );
}

export default PostList;
