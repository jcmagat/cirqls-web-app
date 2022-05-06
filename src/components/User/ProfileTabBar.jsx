import React from "react";
import { useAuthUser } from "../../context/AuthUserContext";
import { useProfileUser } from "../../context/ProfileUserContext";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabPanel from "../Common/TabPanel";
import PostList from "../Post/PostList";
import CommentList from "../Comment/CommentList";
import FollowList from "./FollowList";
import { PROFILE_TABS } from "../../pages/ProfilePage";

function ProfileTabBar({ tab, handleChangeTab }) {
  const authUser = useAuthUser();
  const profileUser = useProfileUser();

  const isAuthUsersProfile =
    authUser && authUser.username === profileUser.username;

  return (
    <>
      <Tabs
        centered
        value={tab}
        onChange={(event, value) => handleChangeTab(value)}
        sx={{ marginTop: 4 }}
      >
        <Tab disableRipple label="Posts" value={PROFILE_TABS.POSTS} />

        {isAuthUsersProfile && (
          <Tab disableRipple label="Comments" value={PROFILE_TABS.COMMENTS} />
        )}

        <Tab disableRipple label="Following" value={PROFILE_TABS.FOLLOWING} />

        <Tab disableRipple label="Followers" value={PROFILE_TABS.FOLLOWERS} />

        {isAuthUsersProfile && (
          <Tab disableRipple label="Saved" value={PROFILE_TABS.SAVED} />
        )}
      </Tabs>

      <TabPanel value={PROFILE_TABS.POSTS} tab={tab}>
        <PostList posts={profileUser.posts} />
      </TabPanel>

      <TabPanel value={PROFILE_TABS.COMMENTS} tab={tab}>
        <CommentList comments={profileUser.comments} />
      </TabPanel>

      <TabPanel value={PROFILE_TABS.FOLLOWING} tab={tab}>
        <FollowList users={profileUser.following} type="following" />
      </TabPanel>

      <TabPanel value={PROFILE_TABS.FOLLOWERS} tab={tab}>
        <FollowList users={profileUser.followers} type="follower" />
      </TabPanel>

      <TabPanel value={PROFILE_TABS.SAVED} tab={tab}>
        <PostList posts={profileUser.saved_posts} />
      </TabPanel>
    </>
  );
}

export default ProfileTabBar;
