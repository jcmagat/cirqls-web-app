import React, { useState, useEffect } from "react";
import { useAuthUser } from "../../context/AuthUserContext";
import { useProfileUser } from "../../context/ProfileUserContext";
import { useMutation } from "@apollo/client";
import { FOLLOW, UNFOLLOW, CHANGE_PROFILE_PIC } from "../../graphql/mutations";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddIcon from "@mui/icons-material/Add";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import Typography from "@mui/material/Typography";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import UploadDialog from "../Common/UploadDialog";
import { PROFILE_TABS } from "../../pages/ProfilePage";

function ProfileHeaderForAuthUser({ handleChangeTab }) {
  const profileUser = useProfileUser();

  const [dialogOpen, setDialogOpen] = useState(false);

  const [changeProfilePic, { loading }] = useMutation(CHANGE_PROFILE_PIC, {
    onCompleted: () => setDialogOpen(false),
  });

  const handleChangeProfilePic = (file) => {
    changeProfilePic({
      variables: {
        profile_pic: file,
      },
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        position: "relative",
      }}
    >
      <Badge
        overlap="circular"
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        badgeContent={
          <IconButton
            size="small"
            sx={{
              borderRadius: "50%",
              color: (theme) => theme.palette.primary.contrastText,
              background: (theme) => theme.palette.primary.main,
              boxShadow: (theme) => theme.shadows[2],
              "&:hover": {
                background: (theme) => theme.palette.primary.dark,
                boxShadow: (theme) => theme.shadows[4],
              },
            }}
            onClick={() => setDialogOpen(true)}
          >
            {profileUser.profile_pic_src ? (
              <EditOutlinedIcon fontSize="small" />
            ) : (
              <AddIcon fontSize="small" />
            )}
          </IconButton>
        }
      >
        <Avatar
          src={profileUser.profile_pic_src}
          sx={{ width: 80, height: 80 }}
        />
      </Badge>

      <UploadDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onDone={handleChangeProfilePic}
        disabled={loading}
      />

      <Typography variant="h6">{`u/${profileUser.username}`}</Typography>

      <ButtonGroup variant="text">
        <Button onClick={() => handleChangeTab(PROFILE_TABS.FOLLOWING)}>
          {profileUser.following.length} Following
        </Button>

        <Button onClick={() => handleChangeTab(PROFILE_TABS.FOLLOWERS)}>
          {profileUser.followers.length} Followers
        </Button>

        <Button>{100} Likes</Button>
      </ButtonGroup>

      <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
        <Button variant="contained" href="/settings">
          Edit Profile
        </Button>

        <Button variant="outlined">
          <BookmarkBorderIcon />
        </Button>
      </Box>
    </Box>
  );
}

function ProfileHeaderForNonAuthUser({ handleChangeTab }) {
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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        position: "relative",
      }}
    >
      <Avatar
        src={profileUser.profile_pic_src}
        sx={{ width: 80, height: 80 }}
      />

      <Typography variant="h6">{`u/${profileUser.username}`}</Typography>

      <ButtonGroup variant="text">
        <Button onClick={() => handleChangeTab(PROFILE_TABS.FOLLOWING)}>
          {profileUser.following.length} Following
        </Button>

        <Button onClick={() => handleChangeTab(PROFILE_TABS.FOLLOWERS)}>
          {profileUser.followers.length} Followers
        </Button>

        <Button>{100} Likes</Button>
      </ButtonGroup>

      <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
        {isFollowed ? (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleUnfollow}
          >
            Unfollow
          </Button>
        ) : (
          <Button variant="contained" onClick={handleFollow}>
            Follow
          </Button>
        )}

        <Button
          variant="outlined"
          href={`/messages?user=${profileUser.username}`}
        >
          Message
        </Button>
      </Box>
    </Box>
  );
}

function ProfileHeader({ handleChangeTab }) {
  const authUser = useAuthUser();
  const profileUser = useProfileUser();

  const isAuthUsersProfile =
    authUser && authUser.username === profileUser.username;

  return (
    <>
      {isAuthUsersProfile ? (
        <ProfileHeaderForAuthUser handleChangeTab={handleChangeTab} />
      ) : (
        <ProfileHeaderForNonAuthUser handleChangeTab={handleChangeTab} />
      )}
    </>
  );
}

export default ProfileHeader;
