import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { useCommunity } from "../context/CommunityContext";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import NavBar from "../components/NavBar";
import CommunityHeader from "../components/Community/CommunityHeader";
import CommunityTabBar from "../components/Community/CommunityTabBar";

const useStyles = makeStyles({
  paper: {
    marginTop: 80,
  },
});

export const COMMUNITY_TABS = {
  POSTS: "posts",
  ABOUT: "about",
};

function CommunityPage(props) {
  const classes = useStyles();

  const community = useCommunity();

  const [tab, setTab] = useState("posts");

  const handleChangeTab = (newTab) => {
    setTab(newTab);
  };

  return (
    <Container>
      <NavBar />

      {community && (
        <Paper className={classes.paper} elevation={0}>
          <CommunityHeader />

          <CommunityTabBar tab={tab} handleChangeTab={handleChangeTab} />
        </Paper>
      )}
    </Container>
  );
}

export default CommunityPage;
