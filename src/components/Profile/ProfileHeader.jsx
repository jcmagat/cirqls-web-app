import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { useAuthUser } from "../../context/AuthUserContext";
import { useProfileUser } from "../../context/ProfileUserContext";
import { useMutation } from "@apollo/client";
import { FOLLOW, UNFOLLOW, CHANGE_USERNAME } from "../../graphql/mutations";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import IconButton from "@material-ui/core/IconButton";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import ProfilePicDialog from "./ProfilePicDialog";
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

function ProfileHeaderForAuthUser(props) {
  const classes = useStyles();

  const profileUser = useProfileUser();

  const [isEditMode, setIsEditMode] = useState(false);
  const [newUsername, setNewUsername] = useState(profileUser.username);
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [isProfilePicDialogOpen, setIsProfilePicDialogOpen] = useState(false);

  const history = useHistory();

  const [changeUsername] = useMutation(CHANGE_USERNAME, {
    onCompleted: (data) => {
      history.push(`/u/${data.changeUsername.username}`);
    },
  });

  const handleEditProfile = () => {
    setIsEditMode(true);
  };

  const handleSaveEdit = () => {
    // Call mutation
    if (newUsername !== profileUser.username) {
      changeUsername({
        variables: {
          username: newUsername,
        },
      });
    }

    if (newProfilePic) {
      console.log(newProfilePic);
    }

    setIsEditMode(false);
  };

  // Called when the edit button on the profile pic is clicked
  const handleEditProfilePic = () => {
    setIsProfilePicDialogOpen(true);
  };

  // Called in ProfilePicDialog to set newProfilePic
  const handleSetNewProfilePic = (pic) => {
    setNewProfilePic(pic);
  };

  // Called in ProfilePicDialog to close the dialog
  const handleCloseProfilePicDialog = () => {
    setIsProfilePicDialogOpen(false);
  };

  const handleCancelEdit = () => {
    setNewUsername(profileUser.username);
    setNewProfilePic(null);
    setIsEditMode(false);
  };

  const handleDeleteAccount = () => {
    console.log("delete account");
  };

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
      {isEditMode && (
        <Button
          className={classes.delete}
          variant="contained"
          color="secondary"
          onClick={handleDeleteAccount}
        >
          Delete Account
        </Button>
      )}

      {isEditMode ? (
        <Paper elevation={0}>
          <Badge
            overlap="circular"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            badgeContent={
              <IconButton onClick={handleEditProfilePic}>
                <EditOutlinedIcon />
              </IconButton>
            }
          >
            <Avatar className={classes.avatar}>
              {profileUser.username.charAt(0).toUpperCase()}
            </Avatar>
          </Badge>

          <ProfilePicDialog
            open={isProfilePicDialogOpen}
            onClose={handleCloseProfilePicDialog}
            onChange={handleSetNewProfilePic}
          />
        </Paper>
      ) : (
        <Avatar className={classes.avatar}>
          {profileUser.username.charAt(0).toUpperCase()}
        </Avatar>
      )}

      {isEditMode ? (
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

      {isEditMode ? (
        <Paper className={classes.buttons} elevation={0}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCancelEdit}
          >
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSaveEdit}>
            Save
          </Button>
        </Paper>
      ) : (
        <Button variant="contained" color="primary" onClick={handleEditProfile}>
          Edit Profile
        </Button>
      )}
    </Paper>
  );
}

function ProfileHeaderForNonAuthUser(props) {
  const classes = useStyles();

  const authUser = useAuthUser();
  const profileUser = useProfileUser();

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
      <Avatar className={classes.avatar}>
        {profileUser.username.charAt(0).toUpperCase()}
      </Avatar>

      <Typography variant="h6">{`u/${profileUser.username}`}</Typography>

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
    </Paper>
  );
}

function ProfileHeader(props) {
  const authUser = useAuthUser();
  const profileUser = useProfileUser();

  const isAuthUsersProfile =
    authUser && authUser.username === profileUser.username;

  return (
    <Paper elevation={0}>
      {isAuthUsersProfile ? (
        <ProfileHeaderForAuthUser />
      ) : (
        <ProfileHeaderForNonAuthUser />
      )}
    </Paper>
  );
}

export default ProfileHeader;
