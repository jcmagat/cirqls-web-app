import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useAuthUser } from "../../context/AuthUserContext";
import { useProfileUser } from "../../context/ProfileUserContext";
import { useMutation } from "@apollo/client";
import { FOLLOW, UNFOLLOW } from "../../graphql/mutations";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import IconButton from "@material-ui/core/IconButton";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import { PROFILE_TABS } from "../../pages/ProfilePage";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    position: "relative",
  },
  delete: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  avatar: {
    width: 80,
    height: 80,
  },
  buttons: {
    display: "flex",
    gap: 8,
  },
});

function ProfileHeader(props) {
  const classes = useStyles();

  const authUser = useAuthUser();
  const profileUser = useProfileUser();

  const isAuthUsersProfile =
    authUser && authUser.username === profileUser.username;

  /* ========== Follow/Unfollow User ========== */

  const [isFollowed, setIsFollowed] = useState(false);

  useEffect(() => {
    if (
      authUser &&
      profileUser.followers.some(
        (follower) => follower.username === authUser.username
      )
    ) {
      setIsFollowed(true);
    } else {
      setIsFollowed(false);
    }
  }, [authUser, profileUser]);

  const [follow] = useMutation(FOLLOW);

  const [unfollow] = useMutation(UNFOLLOW);

  const handleFollow = () => {
    follow({
      variables: {
        username: profileUser.username,
      },
    });
  };

  const handleUnfollow = () => {
    unfollow({
      variables: {
        username: profileUser.username,
      },
    });
  };

  /* ========== Edit Profile ========== */

  const [newUsername, setNewUsername] = useState(profileUser.username);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleEditProfile = () => {
    setIsEditMode(true);
  };

  const handleSaveEdit = () => {
    // Call mutation
    setIsEditMode(false);
  };

  const handleCancelEdit = () => {
    setNewUsername(profileUser.username);
    setIsEditMode(false);
  };

  const handleChangePfp = () => {
    console.log("edit pfp");
  };

  const handleDeleteAccount = () => {
    console.log("delete account");
  };

  /* ========== Etc. ========== */

  const memberSinceDate = new Date(profileUser.created_at).toLocaleDateString(
    "en-us",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <Paper className={classes.paper} elevation={0}>
      {isAuthUsersProfile && isEditMode && (
        <Button
          className={classes.delete}
          variant="contained"
          color="secondary"
          onClick={handleDeleteAccount}
        >
          Delete Account
        </Button>
      )}

      {isAuthUsersProfile && isEditMode ? (
        <Badge
          overlap="circular"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          badgeContent={
            <IconButton onClick={handleChangePfp}>
              <EditOutlinedIcon />
            </IconButton>
          }
        >
          <Avatar className={classes.avatar}>
            {profileUser.username.charAt(0).toUpperCase()}
          </Avatar>
        </Badge>
      ) : (
        <Avatar className={classes.avatar}>
          {profileUser.username.charAt(0).toUpperCase()}
        </Avatar>
      )}

      {isAuthUsersProfile && isEditMode ? (
        <TextField
          inputProps={{ style: { textAlign: "center" } }}
          variant="outlined"
          size="small"
          id="username"
          label="Username"
          value={newUsername}
          onChange={(event) => setNewUsername(event.target.value)}
        />
      ) : (
        <Typography variant="h6">{`u/${profileUser.username}`}</Typography>
      )}

      <Typography variant="body2">
        {`member since ${memberSinceDate}`}
      </Typography>

      <ButtonGroup variant="text">
        <Button onClick={() => props.handleChangeTab(PROFILE_TABS.FOLLOWING)}>
          {profileUser.following.length} Following
        </Button>
        <Button onClick={() => props.handleChangeTab(PROFILE_TABS.FOLLOWERS)}>
          {profileUser.followers.length} Followers
        </Button>
        <Button>{100} Likes</Button>
      </ButtonGroup>

      {isAuthUsersProfile ? (
        <Paper elevation={0}>
          {isEditMode ? (
            <Paper className={classes.buttons} elevation={0}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveEdit}
              >
                Save
              </Button>
            </Paper>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditProfile}
            >
              Edit Profile
            </Button>
          )}
        </Paper>
      ) : (
        <Paper className={classes.buttons} elevation={0}>
          {isFollowed ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleUnfollow}
            >
              Unfollow
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleFollow}>
              Follow
            </Button>
          )}
          <Button
            variant="outlined"
            component={Link}
            to={`/messages?user=${profileUser.username}`}
          >
            Message
          </Button>
        </Paper>
      )}
    </Paper>
  );
}

export default ProfileHeader;
