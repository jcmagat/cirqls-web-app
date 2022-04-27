import React from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
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
