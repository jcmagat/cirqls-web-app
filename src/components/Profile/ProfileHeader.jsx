import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useAuthUser } from "../../context/AuthUserContext";
import { useProfileUser } from "../../context/ProfileUserContext";
import { useMutation } from "@apollo/client";
import { FOLLOW, UNFOLLOW, CHANGE_PROFILE_PIC } from "../../graphql/mutations";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import IconButton from "@material-ui/core/IconButton";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
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

function ProfileHeaderForAuthUser({ handleChangeTab }) {
  const classes = useStyles();

  const profileUser = useProfileUser();

  const [isEditMode, setIsEditMode] = useState(false);
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [isProfilePicDialogOpen, setIsProfilePicDialogOpen] = useState(false);

  const [changeProfilePic, { loading: changeProfilePicLoading }] = useMutation(
    CHANGE_PROFILE_PIC,
    {
      onCompleted: finishChangeProfilePic,
    }
  );

  const handleEditProfile = () => {
    setIsEditMode(true);
  };

  const handleSaveEdit = () => {
    if (!newProfilePic) {
      setIsEditMode(false);
      return;
    }

    changeProfilePic({
      variables: {
        profile_pic: newProfilePic,
      },
    });
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
    setNewProfilePic(null);
    setIsEditMode(false);
  };

  function finishChangeProfilePic() {
    setNewProfilePic(null);
    setIsEditMode(false);
  }

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
      {isEditMode ? (
        <Badge
          overlap="circular"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          badgeContent={
            <IconButton
              onClick={handleEditProfilePic}
              disabled={changeProfilePicLoading}
            >
              <EditOutlinedIcon />
            </IconButton>
          }
        >
          <Avatar
            className={classes.avatar}
            src={
              newProfilePic
                ? URL.createObjectURL(newProfilePic)
                : profileUser.profile_pic_src
            }
          />
        </Badge>
      ) : (
        <Avatar className={classes.avatar} src={profileUser.profile_pic_src} />
      )}

      <ProfilePicDialog
        open={isProfilePicDialogOpen}
        onClose={handleCloseProfilePicDialog}
        onChange={handleSetNewProfilePic}
      />

      <Typography variant="h6">{`u/${profileUser.username}`}</Typography>

      <Typography variant="body2">
        {`member since ${memberSinceDate}`}
      </Typography>

      <ButtonGroup variant="text">
        <Button onClick={() => handleChangeTab(PROFILE_TABS.FOLLOWING)}>
          {profileUser.following.length} Following
        </Button>
        <Button onClick={() => handleChangeTab(PROFILE_TABS.FOLLOWERS)}>
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
            disabled={changeProfilePicLoading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveEdit}
            disabled={changeProfilePicLoading}
          >
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

function ProfileHeaderForNonAuthUser({ handleChangeTab }) {
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
      <Avatar className={classes.avatar} src={profileUser.profile_pic_src} />

      <Typography variant="h6">{`u/${profileUser.username}`}</Typography>

      <Typography variant="body2">
        {`member since ${memberSinceDate}`}
      </Typography>

      <ButtonGroup variant="text">
        <Button onClick={() => handleChangeTab(PROFILE_TABS.FOLLOWING)}>
          {profileUser.following.length} Following
        </Button>
        <Button onClick={() => handleChangeTab(PROFILE_TABS.FOLLOWERS)}>
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

function ProfileHeader({ handleChangeTab }) {
  const authUser = useAuthUser();
  const profileUser = useProfileUser();

  const isAuthUsersProfile =
    authUser && authUser.username === profileUser.username;

  return (
    <Paper elevation={0}>
      {isAuthUsersProfile ? (
        <ProfileHeaderForAuthUser handleChangeTab={handleChangeTab} />
      ) : (
        <ProfileHeaderForNonAuthUser handleChangeTab={handleChangeTab} />
      )}
    </Paper>
  );
}

export default ProfileHeader;
