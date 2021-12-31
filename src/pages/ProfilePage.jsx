import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import NavBar from "../components/NavBar";
import ProfileHeader from "../components/ProfileHeader";
import ProfileTabBar from "../components/ProfileTabBar";
import { useQuery } from "@apollo/client";
import { GET_USER } from "../graphql/queries";

const useStyles = makeStyles({
  paper: {
    marginTop: 80,
  },
  tabs: {
    marginTop: 16,
  },
});

function ProfilePage(props) {
  const location = useLocation();
  const username = location.pathname.split("/")[2];

  const classes = useStyles();

  const [user, setUser] = useState();

  const [tab, setTab] = useState("overview");

  const { data: getUserData } = useQuery(GET_USER, {
    variables: {
      username: username,
    },
  });

  useEffect(() => {
    if (getUserData) {
      setUser(getUserData.user);
    }
  }, [getUserData]);

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
            user={user}
            showFollowing={showFollowing}
            showFollowers={showFollowers}
          />

          <Paper className={classes.tabs} elevation={0}>
            <ProfileTabBar user={user} tab={tab} onChange={handleChangeTab} />
          </Paper>
        </Paper>
      )}
    </Container>
  );
}

export default ProfilePage;
