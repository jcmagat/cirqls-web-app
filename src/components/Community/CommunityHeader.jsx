import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import { useAuthUser } from "../../context/AuthUserContext";
import { useCommunity } from "../../context/CommunityContext";
import { useMutation } from "@apollo/client";
import { JOIN, LEAVE } from "../../graphql/mutations";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Popover from "@material-ui/core/Popover";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import FlagOutlinedIcon from "@material-ui/icons/FlagOutlined";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    position: "relative",
  },
  more: {
    position: "absolute",
    top: 0,
    right: 8,
  },
  avatar: {
    width: 80,
    height: 80,
  },
});

function CommunityHeader(props) {
  const classes = useStyles();

  const authUser = useAuthUser();
  const community = useCommunity();

  const isModerator =
    authUser &&
    community.moderators.some(
      (moderator) => moderator.username === authUser.username
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
    <Paper className={classes.root} elevation={0}>
      <Avatar className={classes.avatar}>
        {community.name.charAt(0).toUpperCase()}
      </Avatar>

      <IconButton
        className={classes.more}
        onClick={(event) => setMoreMenuAnchor(event.currentTarget)}
      >
        <MoreVertIcon />
      </IconButton>
      <Popover
        open={Boolean(moreMenuAnchor)}
        anchorEl={moreMenuAnchor}
        onClose={(event) => setMoreMenuAnchor(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <ButtonGroup orientation="vertical">
          {isModerator && (
            <IconButton component={Link} to={`/c/${community.name}/edit`}>
              <EditOutlinedIcon />
              <Typography>Edit</Typography>
            </IconButton>
          )}

          <IconButton>
            <FlagOutlinedIcon />
            <Typography>Report</Typography>
          </IconButton>
        </ButtonGroup>
      </Popover>

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
    </Paper>
  );
}

export default CommunityHeader;
