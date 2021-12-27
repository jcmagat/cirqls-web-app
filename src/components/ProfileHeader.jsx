import React from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";

function ProfileHeader(props) {
  return (
    <Paper elevation={0}>
      <AccountCircleOutlinedIcon fontSize="large" />
      <Typography>{props.user.username}</Typography>
      <Typography>
        member since {new Date(props.user.created_at).toString()}
      </Typography>

      <Button>{props.user.followers.count} followers</Button>
      <Button>{props.user.following.count} following</Button>

      <Paper elevation={0}>
        <Button>follow</Button>
        <Button>message</Button>
      </Paper>
    </Paper>
  );
}

export default ProfileHeader;
