import React from "react";
import makeStyles from "@mui/styles/makeStyles";
import { useCommunity } from "../../context/CommunityContext";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Link from "@mui/material/Link";

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
    <>
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

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 1,
        }}
      >
        {community.moderators.map((moderator) => (
          <Box
            key={moderator.user_id}
            component={Link}
            href={`/u/${moderator.username}`}
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar src={moderator.profile_pic_src} />
            <Typography>{`u/${moderator.username}`}</Typography>
          </Box>
        ))}
      </Box>
    </>
  );
}

export default CommunityAbout;
