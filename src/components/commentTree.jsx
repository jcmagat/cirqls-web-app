import React from "react";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import CommentCard from "./commentCard";

function CommentTree(props) {
  const renderCommentTree = (comment) => {
    return (
      <TreeItem key={comment.comment_id} nodeId={comment.comment_id.toString()}>
        <CommentCard
          comment={comment}
          handleCommentReactionChange={props.handleCommentReactionChange}
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
      defaultExpanded={props.comment_ids.map(String)}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {props.comments.map((comment) => renderCommentTree(comment))}
    </TreeView>
  );
}

export default CommentTree;
