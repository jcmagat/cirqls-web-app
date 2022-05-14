import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { GET_POST, GET_POST_COMMENTS, GET_COMMENT } from "../graphql/queries";
import { ADD_COMMENT } from "../graphql/mutations";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import NavBar from "../components/Navigation/NavBar";
import PostCard from "../components/Post/PostCard";
import CommentForm from "../components/Comment/CommentForm";
import CommentTree from "../components/Comment/CommentTree";

function PostPage(props) {
  const { id } = useParams();
  const post_id = parseInt(id);

  const { search } = useLocation();
  const { comment } = queryString.parse(search);

  const [post, setPost] = useState();
  const [comments, setComments] = useState([]);

  /* ========== Get Post ========== */

  const { data: getPostData } = useQuery(GET_POST, {
    variables: { post_id: post_id },
  });

  useEffect(() => {
    if (getPostData) {
      setPost(getPostData.post);
    }
  }, [getPostData]);

  /* ========== Get Comments ========== */

  // Get all comments for post
  const [getPostComments, { data: getPostCommentsData }] = useLazyQuery(
    GET_POST_COMMENTS,
    {
      variables: { post_id: post_id },
    }
  );

  // Get a single comment tree
  const [getComment, { data: getCommentData }] = useLazyQuery(GET_COMMENT, {
    variables: { comment_id: parseInt(comment) },
  });

  // This has to be done instead of using onCompleted, because otherwise
  // the comments in cache would not update after a mutation
  // such as adding a comment reaction
  useEffect(() => {
    if (comment) {
      getComment();

      if (getCommentData) setComments([getCommentData.comment]);
    } else {
      getPostComments();

      if (getPostCommentsData) setComments(getPostCommentsData.postComments);
    }
  }, [
    comment,
    getComment,
    getCommentData,
    getPostComments,
    getPostCommentsData,
  ]);

  /* ========== Add Comment ========== */

  const [addComment] = useMutation(ADD_COMMENT, {
    refetchQueries: [
      { query: GET_POST, variables: { post_id: post ? post.post_id : null } },
      {
        query: GET_POST_COMMENTS,
        variables: { post_id: post ? post.post_id : null },
      },
    ],
  });

  const handleAddComment = (message) => {
    addComment({
      variables: {
        parent_comment_id: null,
        post_id: post.post_id,
        message: message,
      },
    });
  };

  return (
    <Container component="main">
      <NavBar />

      {post && (
        <Box
          sx={{
            marginTop: 12,
            marginBottom: 12,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <PostCard post={post} />

          <CommentForm
            open={true}
            autoFocus={false}
            showCancelButton={false}
            onSubmit={handleAddComment}
          />

          <CommentTree
            comments={comments}
            comment_ids={post.comments_info.comment_ids}
            ref_comment_id={parseInt(comment)}
          />
        </Box>
      )}
    </Container>
  );
}

export default PostPage;
