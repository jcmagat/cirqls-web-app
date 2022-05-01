import React, { useState } from "react";
import makeStyles from "@mui/styles/makeStyles";
import { useProfileUser } from "../context/ProfileUserContext";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import NavBar from "../components/Navigation/NavBar";
import ProfileHeader from "../components/User/ProfileHeader";
import ProfileTabBar from "../components/User/ProfileTabBar";

const useStyles = makeStyles({
  paper: {
    marginTop: 80,
  },
  tabs: {
    marginTop: 16,
  },
});

export const PROFILE_TABS = {
  POSTS: "posts",
  COMMENTS: "comments",
  FOLLOWING: "following",
  FOLLOWERS: "followers",
  SAVED: "saved",
};

function ProfilePage(props) {
  const classes = useStyles();

  const user = useProfileUser();

  const [tab, setTab] = useState(PROFILE_TABS.POSTS);

  const handleChangeTab = (newTab) => {
    setTab(newTab);
  };

  return (
    <Container component="main">
      <NavBar />

      {user && (
        <Paper className={classes.paper} elevation={0}>
          <ProfileHeader handleChangeTab={handleChangeTab} />

          <Paper className={classes.tabs} elevation={0}>
            <ProfileTabBar tab={tab} handleChangeTab={handleChangeTab} />
          </Paper>
        </Paper>
      )}
    </Container>
  );
}

export default ProfilePage;
