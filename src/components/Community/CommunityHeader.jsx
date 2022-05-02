import React, { useState, useEffect } from "react";
import { useAuthUser } from "../../context/AuthUserContext";
import { useCommunity } from "../../context/CommunityContext";
import { useMutation } from "@apollo/client";
import { JOIN, LEAVE } from "../../graphql/mutations";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import StyledMenuItem from "../Common/StyledMenuItem";
import Link from "@mui/material/Link";

function CommunityHeader(props) {
  const authUser = useAuthUser();
  const community = useCommunity();

  const isModerator =
    authUser &&
    community.moderators.some(
      (moderator) => moderator.user_id === authUser.user_id
    );

  const [joined, setJoined] = useState(false);
  const [moreMenuAnchor, setMoreMenuAnchor] = useState(null);

  useEffect(() => {
    if (
      authUser &&
      community.members.some((member) => member.username === authUser.username)
    ) {
      setJoined(true);
    } else {
      setJoined(false);
    }
  }, [authUser, community]);

  const [join] = useMutation(JOIN);
  const [leave] = useMutation(LEAVE);

  const handleJoin = () => {
    join({
      variables: {
        community_id: community.community_id,
      },
    });
  };

  const handleLeave = () => {
    leave({
      variables: {
        community_id: community.community_id,
      },
    });
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Avatar src={community.logo_src} sx={{ height: 120, width: 120 }} />

      <IconButton
        sx={{ position: "absolute", top: 0, right: 0 }}
        onClick={(event) => setMoreMenuAnchor(event.currentTarget)}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        open={Boolean(moreMenuAnchor)}
        anchorEl={moreMenuAnchor}
        onClose={(event) => setMoreMenuAnchor(null)}
      >
        {isModerator && (
          <StyledMenuItem component={Link} href={`/c/${community.name}/edit`}>
            <EditOutlinedIcon />
            Edit
          </StyledMenuItem>
        )}

        <StyledMenuItem>
          <FlagOutlinedIcon />
          Report
        </StyledMenuItem>
      </Menu>

      <Typography variant="h5">{`c/${community.name}`}</Typography>
      <Typography variant="h5">{community.title}</Typography>
      <Typography variant="body2">{`${community.members.length} members`}</Typography>

      {joined ? (
        <Button variant="outlined" color="primary" onClick={handleLeave}>
          Joined
        </Button>
      ) : (
        <Button variant="contained" color="primary" onClick={handleJoin}>
          Join
        </Button>
      )}
    </Box>
  );
}

export default CommunityHeader;
