import React from "react";
import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import PostList from "./PostList";
import FollowList from "./FollowList";

function ProfileTabBar(props) {
  return (
    <Paper elevation={0}>
      <TabContext value={props.tab}>
        <TabList
          centered={true}
          indicatorColor="primary"
          onChange={(event, value) => props.onChange(value)}
        >
          <Tab label="Overview" value="overview" />
          <Tab label="Posts" value="posts" />
          <Tab label="Comments" value="comments" />
          <Tab label="Following" value="following" />
          <Tab label="Followers" value="followers" />
        </TabList>

        <TabPanel value="overview">
          <PostList posts={props.user.posts} />
        </TabPanel>

        <TabPanel value="posts">
          <PostList posts={props.user.posts} />
        </TabPanel>

        <TabPanel value="comments">Comments</TabPanel>

        <TabPanel value="following">
          <FollowList users={props.user.following} type="following" />
        </TabPanel>

        <TabPanel value="followers">
          <FollowList users={props.user.followers} type="follower" />
        </TabPanel>
      </TabContext>
    </Paper>
  );
}

export default ProfileTabBar;
