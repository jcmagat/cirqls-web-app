import React from "react";
import { useCommunity } from "../context/CommunityContext";
import { Paper, Typography } from "@material-ui/core";

function CommunityAbout(props) {
  const community = useCommunity();

  return (
    <Paper elevation={0}>
      <Typography variant="body1">{community.description}</Typography>
    </Paper>
  );
}

export default CommunityAbout;
