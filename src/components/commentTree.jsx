import React, { useState, useEffect } from "react";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import CommentCard from "./commentCard";

function CommentTree(props) {
  const [commentIds, setCommentIds] = useState([]);

  const [newComment, setNewComment] = useState({});

  useEffect(() => {
    setCommentIds(props.comment_ids);
  }, [props.comment_ids]);

  const finishAddComment = (data) => {
    setNewComment(data.addComment);
    setCommentIds([...commentIds, data.addComment.comment_id.toString()]);
  };

  const insertComment = (comment) => {
    return (
      <TreeItem nodeId={comment.comment_id.toString()}>
        <CommentCard
          comment={comment}
          handleCommentReactionChange={props.handleCommentReactionChange}
          finishAddComment={finishAddComment}
        />
      </TreeItem>
    );
  };

  const renderCommentTree = (comment) => {
    return (
      <TreeItem key={comment.comment_id} nodeId={comment.comment_id.toString()}>
        <CommentCard
          comment={comment}
          handleCommentReactionChange={props.handleCommentReactionChange}
          finishAddComment={finishAddComment}
        />

        {newComment.parent_comment_id === comment.comment_id &&
          insertComment(newComment)}

        {Array.isArray(comment.child_comments)
          ? comment.child_comments.map((comments) =>
              renderCommentTree(comments)
            )
          : null}
      </TreeItem>
    );
  };

  return (
    <TreeView
      expanded={commentIds.map(String)}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {props.comments.map((comment) => renderCommentTree(comment))}
    </TreeView>
  );
}

export default CommentTree;
