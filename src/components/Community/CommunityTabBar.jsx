import React from "react";
import { useCommunity } from "../../context/CommunityContext";
import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import PostList from "../Post/PostList";
import CommunityAbout from "./CommunityAbout";
import { COMMUNITY_TABS } from "../../pages/CommunityPage";

function CommunityTabBar({ tab, handleChangeTab }) {
  const community = useCommunity();

  return (
    <Paper elevation={0}>
      <TabContext value={tab}>
        <TabList
          centered={true}
          indicatorColor="primary"
          onChange={(event, value) => handleChangeTab(value)}
        >
          <Tab label="Posts" value={COMMUNITY_TABS.POSTS} />
          <Tab label="About" value={COMMUNITY_TABS.ABOUT} />
        </TabList>

        <TabPanel value={COMMUNITY_TABS.POSTS}>
          <PostList posts={community.posts} />
        </TabPanel>

        <TabPanel value={COMMUNITY_TABS.ABOUT}>
          <CommunityAbout />
        </TabPanel>
      </TabContext>
    </Paper>
  );
}

export default CommunityTabBar;
