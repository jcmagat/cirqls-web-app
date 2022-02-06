import React from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import CommentCard from "./CommentCard";

function CommentList({ comments }) {
  return (
    <Paper elevation={0}>
      {comments && (
        <Grid container spacing={2} direction="column-reverse">
          {comments.map((comment) => (
            <Grid item key={comment.comment_id}>
              <CommentCard comment={comment} />
            </Grid>
          ))}
        </Grid>
      )}
    </Paper>
  );
}

export default CommentList;
