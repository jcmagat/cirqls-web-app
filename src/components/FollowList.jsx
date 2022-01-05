import React from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import FollowCard from "./FollowCard";

function FollowList(props) {
  return (
    <Paper elevation={0}>
      <Grid container spacing={2} direction="column">
        {props.users.map((user) => (
          <Grid item key={user.username}>
            <FollowCard user={user} type={props.type} />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

export default FollowList;
