import React, { useState } from "react";
import { useCommunity } from "../context/CommunityContext";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import NavBar from "../components/Navigation/NavBar";
import CommunityHeader from "../components/Community/CommunityHeader";
import CommunityTabBar from "../components/Community/CommunityTabBar";

export const COMMUNITY_TABS = {
  POSTS: "posts",
  ABOUT: "about",
};

function CommunityPage(props) {
  const community = useCommunity();

  const [tab, setTab] = useState("posts");

  const handleChangeTab = (newTab) => {
    setTab(newTab);
  };

  return (
    <Container>
      <NavBar />

      {community && (
        <Box sx={{ marginTop: 12, maxWidth: 800, marginInline: "auto" }}>
          <CommunityHeader />

          <Box sx={{ marginTop: 4 }}>
            <CommunityTabBar tab={tab} handleChangeTab={handleChangeTab} />
          </Box>
        </Box>
      )}
    </Container>
  );
}

export default CommunityPage;
