import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import NavBar from "../components/NavBar";
import ProfileHeader from "../components/ProfileHeader";
import ProfileTabBar from "../components/ProfileTabBar";
import { useProfileUser } from "../context/ProfileUserContext";

const useStyles = makeStyles({
  paper: {
    marginTop: 80,
  },
  tabs: {
    marginTop: 16,
  },
});

function ProfilePage(props) {
  const classes = useStyles();

  const user = useProfileUser();

  const [tab, setTab] = useState("overview");

  const handleChangeTab = (newTab) => {
    setTab(newTab);
  };

  const showFollowing = () => {
    setTab("following");
  };

  const showFollowers = () => {
    setTab("followers");
  };

  return (
    <Container component="main">
      <NavBar />

      {user && (
        <Paper className={classes.paper} elevation={0}>
          <ProfileHeader
            showFollowing={showFollowing}
            showFollowers={showFollowers}
          />

          <Paper className={classes.tabs} elevation={0}>
            <ProfileTabBar tab={tab} onChange={handleChangeTab} />
          </Paper>
        </Paper>
      )}
    </Container>
  );
}

export default ProfilePage;
