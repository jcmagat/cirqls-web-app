import React from "react";
import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import PostList from "./PostList";
import FollowList from "./FollowList";
import { useProfileUser } from "../context/ProfileUserContext";
import { TABS } from "../pages/ProfilePage";

function ProfileTabBar(props) {
  const profileUser = useProfileUser();

  return (
    <Paper elevation={0}>
      <TabContext value={props.tab}>
        <TabList
          centered={true}
          indicatorColor="primary"
          onChange={(event, value) => props.handleChangeTab(value)}
        >
          <Tab label="Overview" value={TABS.OVERVIEW} />
          <Tab label="Posts" value={TABS.POSTS} />
          <Tab label="Comments" value={TABS.COMMENTS} />
          <Tab label="Following" value={TABS.FOLLOWING} />
          <Tab label="Followers" value={TABS.FOLLOWERS} />
          <Tab label="Saved" value={TABS.SAVED} />
        </TabList>

        <TabPanel value={TABS.OVERVIEW}>
          <PostList posts={profileUser.posts} />
        </TabPanel>

        <TabPanel value={TABS.POSTS}>
          <PostList posts={profileUser.posts} />
        </TabPanel>

        <TabPanel value={TABS.COMMENTS}>Comments</TabPanel>

        <TabPanel value={TABS.FOLLOWING}>
          <FollowList users={profileUser.following} type="following" />
        </TabPanel>

        <TabPanel value={TABS.FOLLOWERS}>
          <FollowList users={profileUser.followers} type="follower" />
        </TabPanel>

        <TabPanel value={TABS.SAVED}>Saved</TabPanel>
      </TabContext>
    </Paper>
  );
}

export default ProfileTabBar;
