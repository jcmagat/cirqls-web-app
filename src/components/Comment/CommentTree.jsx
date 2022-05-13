import React, { useState, useEffect, useCallback } from "react";
import { styled } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CommentCard from "./CommentCard";

const StyledTreeItem = styled(TreeItem)(({ theme }) => ({
  "& .MuiTreeItem-content": {
    paddingLeft: 0,
    background: "inherit",
    "&:hover": {
      background: "inherit",
    },
  },
  "& .MuiTreeItem-group": {
    marginLeft: 7,
    paddingLeft: 20,
    borderLeft: "1px solid black",
  },
}));

function CommentTree({ comments, comment_ids, ref_comment_id }) {
  let maxHeight = 20;

  if (useMediaQuery((theme) => theme.breakpoints.down("md"))) {
    maxHeight = 10;
  }

  if (useMediaQuery((theme) => theme.breakpoints.down("sm"))) {
    maxHeight = 4;
  }

  const [expanded, setExpanded] = useState([]);

  useEffect(() => {
    setExpanded(comment_ids.map(String));
  }, [comment_ids]);

  const commentRef = useCallback((node) => {
    if (node) node.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const renderCommentTree = (comment, height) => {
    if (!comment) return;

    if (height <= maxHeight) {
      return (
        <StyledTreeItem
          key={comment.comment_id}
          nodeId={comment.comment_id.toString()}
          ref={comment.comment_id === ref_comment_id ? commentRef : null}
          label={
            !expanded.includes(comment.comment_id.toString()) && (
              <Typography variant="body2">
                {`Expand u/${comment.commenter.username}'s comment`}
              </Typography>
            )
          }
        >
          <CommentCard
            comment={comment}
            elevation={comment.comment_id === ref_comment_id ? 16 : 1}
          />

          {
            // Only render 1 child comment past maxHeight (which will be a
            // button to show more comments, see else condition below)
            height < maxHeight
              ? Array.isArray(comment.child_comments) &&
                comment.child_comments.map((comments) =>
                  renderCommentTree(comments, height + 1)
                )
              : Array.isArray(comment.child_comments) &&
                renderCommentTree(comment.child_comments[0], height + 1)
          }
        </StyledTreeItem>
      );
    } else {
      return (
        <StyledTreeItem
          key={comment.comment_id}
          nodeId={comment.comment_id.toString()}
        >
          <Button variant="outlined">More Comments</Button>
        </StyledTreeItem>
      );
    }
  };

  return (
    <TreeView
      expanded={expanded}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      onNodeToggle={(event, nodeIds) => setExpanded(nodeIds)}
    >
      {comments.map((comment) => renderCommentTree(comment, 1))}
    </TreeView>
  );
}

export default CommentTree;
