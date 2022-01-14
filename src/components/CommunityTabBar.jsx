import React from "react";
import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import PostList from "./PostList";
import { COMMUNITY_TABS } from "../pages/CommunityPage";
import { useCommunity } from "../context/CommunityContext";

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
          <h1>About</h1>
        </TabPanel>
      </TabContext>
    </Paper>
  );
}

export default CommunityTabBar;
