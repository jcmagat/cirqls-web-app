import React from "react";
import makeStyles from '@mui/styles/makeStyles';
import { useCommunity } from "../../context/CommunityContext";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  moderator: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    width: "max-content",
  },
});

function CommunityAbout(props) {
  const classes = useStyles();

  const community = useCommunity();

  const startedDate = new Date(community.created_at).toLocaleDateString(
    "en-us",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <Paper elevation={0}>
      <Typography variant="body1" paragraph>
        {community.description}
      </Typography>

      <Typography variant="body2" paragraph>
        {community.type.charAt(0).toUpperCase() + community.type.slice(1)}
      </Typography>

      <Typography
        variant="body2"
        paragraph
      >{`Started ${startedDate}`}</Typography>

      <Typography variant="body1" gutterBottom>
        Moderators:
      </Typography>

      {community.moderators.map((moderator) => (
        <Paper
          className={classes.moderator}
          elevation={0}
          key={moderator.user_id}
          component={Link}
          to={`/u/${moderator.username}`}
        >
          <Avatar src={moderator.profile_pic_src} />
          <Typography>{`u/${moderator.username}`}</Typography>
        </Paper>
      ))}
    </Paper>
  );
}

export default CommunityAbout;
