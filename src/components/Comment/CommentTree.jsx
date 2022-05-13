import React, { useState, useEffect, useCallback } from "react";
import { styled } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useHistory } from "react-router-dom";
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
  [theme.breakpoints.down("md")]: {
    "& .MuiTreeItem-group": {
      paddingLeft: 15,
    },
  },
  [theme.breakpoints.down("sm")]: {
    "& .MuiTreeItem-group": {
      paddingLeft: 10,
    },
  },
}));

function MoreCommentsButton({ comment }) {
  const history = useHistory();

  const handleClick = () => {
    history.push({ search: `comment=${comment.comment_id}` });
  };

  return (
    <StyledTreeItem
      key={comment.child_comments[0].comment_id}
      nodeId={comment.child_comments[0].comment_id.toString()}
    >
      <Button variant="outlined" onClick={handleClick}>
        More Comments
      </Button>
    </StyledTreeItem>
  );
}

function CommentTree({ comments, comment_ids, ref_comment_id }) {
  let maxHeight = 20;

  if (useMediaQuery((theme) => theme.breakpoints.down("md"))) {
    maxHeight = 12;
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
          elevation={comment.comment_id === ref_comment_id && 4}
        />

        {
          // Only render 1 child comment past maxHeight (which will be a
          // button to show more comments, see else condition below)
          height < maxHeight
            ? Array.isArray(comment.child_comments) &&
              comment.child_comments.map((child_comment) =>
                renderCommentTree(child_comment, height + 1)
              )
            : Array.isArray(comment.child_comments) &&
              comment.child_comments.length > 0 && (
                <MoreCommentsButton comment={comment} />
              )
        }
      </StyledTreeItem>
    );
  };

  return (
    <TreeView
      expanded={expanded}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      onNodeToggle={(event, nodeIds) => setExpanded(nodeIds)}
    >
      {Array.isArray(comments) &&
        comments.map((comment) => renderCommentTree(comment, 1))}
    </TreeView>
  );
}

export default CommentTree;
