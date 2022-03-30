import React, { useState, useEffect, useCallback } from "react";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import CommentCard from "./CommentCard";

function CommentTree({ comments, comment_ids, ref_comment_id }) {
  const [expanded, setExpanded] = useState([]);

  useEffect(() => {
    setExpanded(comment_ids.map(String));
  }, [comment_ids]);

  const commentRef = useCallback((node) => {
    if (node) node.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const renderCommentTree = (comment) => {
    return (
      <TreeItem
        key={comment.comment_id}
        nodeId={comment.comment_id.toString()}
        ref={comment.comment_id === ref_comment_id ? commentRef : null}
      >
        <CommentCard comment={comment} />

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
      expanded={expanded}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      onNodeToggle={(event, nodeIds) => setExpanded(nodeIds)}
    >
      {comments.map((comment) => renderCommentTree(comment))}
    </TreeView>
  );
}

export default CommentTree;
