import React from "react";
import { useAuthUser } from "../../context/AuthUserContext";
import { useProfileUser } from "../../context/ProfileUserContext";
import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import PostList from "../Post/PostList";
import CommentList from "../Comment/CommentList";
import FollowList from "./FollowList";
import { PROFILE_TABS } from "../../pages/ProfilePage";

function ProfileTabBar(props) {
  const authUser = useAuthUser();
  const profileUser = useProfileUser();

  const isAuthUsersProfile =
    authUser && authUser.username === profileUser.username;

  return (
    <Paper elevation={0}>
      <TabContext value={props.tab}>
        {isAuthUsersProfile ? (
          <TabList
            centered={true}
            indicatorColor="primary"
            onChange={(event, value) => props.handleChangeTab(value)}
          >
            <Tab label="Posts" value={PROFILE_TABS.POSTS} />
            <Tab label="Comments" value={PROFILE_TABS.COMMENTS} />
            <Tab label="Following" value={PROFILE_TABS.FOLLOWING} />
            <Tab label="Followers" value={PROFILE_TABS.FOLLOWERS} />
            <Tab label="Saved" value={PROFILE_TABS.SAVED} />
          </TabList>
        ) : (
          <TabList
            centered={true}
            indicatorColor="primary"
            onChange={(event, value) => props.handleChangeTab(value)}
          >
            <Tab label="Posts" value={PROFILE_TABS.POSTS} />
            <Tab label="Following" value={PROFILE_TABS.FOLLOWING} />
            <Tab label="Followers" value={PROFILE_TABS.FOLLOWERS} />
          </TabList>
        )}

        <TabPanel value={PROFILE_TABS.POSTS}>
          <PostList posts={profileUser.posts} />
        </TabPanel>

        <TabPanel value={PROFILE_TABS.COMMENTS}>
          <CommentList comments={profileUser.comments} />
        </TabPanel>

        <TabPanel value={PROFILE_TABS.FOLLOWING}>
          <FollowList users={profileUser.following} type="following" />
        </TabPanel>

        <TabPanel value={PROFILE_TABS.FOLLOWERS}>
          <FollowList users={profileUser.followers} type="follower" />
        </TabPanel>

        <TabPanel value={PROFILE_TABS.SAVED}>
          <PostList posts={profileUser.saved_posts} />
        </TabPanel>
      </TabContext>
    </Paper>
  );
}

export default ProfileTabBar;
