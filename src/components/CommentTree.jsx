import React, { useState, useEffect } from "react";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import CommentCard from "./CommentCard";

function CommentTree(props) {
  const [expanded, setExpanded] = useState([]);

  useEffect(() => {
    setExpanded(props.comment_ids.map(String));
  }, [props.comment_ids]);

  const renderCommentTree = (comment) => {
    return (
      <TreeItem key={comment.comment_id} nodeId={comment.comment_id.toString()}>
        <CommentCard
          comment={comment}
          handleCommentReactionChange={props.handleCommentReactionChange}
          finishAddComment={props.finishAddComment}
          removeComment={props.removeComment}
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
    <TreeView
      expanded={expanded}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      onNodeToggle={(event, nodeIds) => setExpanded(nodeIds)}
    >
      {props.comments.map((comment) => renderCommentTree(comment))}
    </TreeView>
  );
}

export default CommentTree;
