import React, { useState } from "react";
import { useCommunity } from "../context/CommunityContext";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import NavBar from "../components/Navigation/NavBar";
import CommunityHeader from "../components/Community/CommunityHeader";
import TabPanel from "../components/Common/TabPanel";
import PostList from "../components/Post/PostList";
import CommunityAbout from "../components/Community/CommunityAbout";

const TABS = {
  POSTS: "posts",
  ABOUT: "about",
};

function CommunityPage(props) {
  const community = useCommunity();

  const [tab, setTab] = useState(TABS.POSTS);

  return (
    <Container>
      <NavBar />

      {community && (
        <Box
          sx={{
            marginTop: 12,
            marginBottom: 12,
            maxWidth: 800,
            marginInline: "auto",
          }}
        >
          <CommunityHeader />

          <Tabs
            centered
            value={tab}
            onChange={(event, value) => setTab(value)}
            sx={{ marginTop: 4 }}
          >
            <Tab disableRipple label="Posts" value={TABS.POSTS} />
            <Tab disableRipple label="About" value={TABS.ABOUT} />
          </Tabs>

          <TabPanel value={TABS.POSTS} tab={tab}>
            <PostList posts={community.posts} />
          </TabPanel>

          <TabPanel value={TABS.ABOUT} tab={tab}>
            <CommunityAbout />
          </TabPanel>
        </Box>
      )}
    </Container>
  );
}

export default CommunityPage;
