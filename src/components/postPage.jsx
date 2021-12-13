import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import NavBar from "./navBar";
import PostCard from "./postCard";
import CommentCard from "./commentCard";
import { useQuery } from "@apollo/client";
import { GET_POST, GET_COMMENTS } from "../graphql/queries";

const useStyles = makeStyles({
  paper: {
    marginTop: 80,
  },
});

function PostPage(props) {
  const location = useLocation();
  const post_id = parseInt(location.pathname.split("/")[2]);

  const classes = useStyles();

  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);

  const { data: getPostData } = useQuery(GET_POST, {
    variables: { post_id: post_id },
  });

  const { data: getCommentsData, refetch: refetchComments } = useQuery(
    GET_COMMENTS,
    {
      variables: { post_id: post_id },
    }
  );

  useEffect(() => {
    if (getPostData) {
      setPost(getPostData.post || {});
    }
  }, [getPostData]);

  useEffect(() => {
    if (getCommentsData) {
      setComments(getCommentsData.comments);
    }
  }, [getCommentsData]);

  // Called in commentCard when a comment has been liked or disliked
  const handleCommentReactionChange = (data) => {
    refetchComments();
  };

  const renderCommentTree = (comment) => {
    return (
      <TreeItem key={comment.comment_id} nodeId={comment.comment_id.toString()}>
        <CommentCard
          comment={comment}
          handleCommentReactionChange={handleCommentReactionChange}
        />
        {Array.isArray(comment.child_comments)
          ? comment.child_comments.map((comments) =>
              renderCommentTree(comments)
            )
          : null}
      </TreeItem>
    );
  };

  return (
    <Container>
      <NavBar />
      <Paper className={classes.paper} elevation={0}>
        {Object.keys(post).length > 0 && <PostCard post={post} />}

        <TreeView
          defaultExpanded={[
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "20",
          ]}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          {comments.map((comment) => renderCommentTree(comment))}
        </TreeView>
      </Paper>
    </Container>
  );
}

export default PostPage;
