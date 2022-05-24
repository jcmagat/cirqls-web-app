import { useAuthUser } from "../../context/AuthUserContext";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabPanel from "../Common/TabPanel";
import PostList from "../Post/PostList";
import CommentList from "../Comment/CommentList";
import FollowList from "./FollowList";
import { PROFILE_TABS } from "../../pages/ProfilePage";

function ProfileTabBar({ profileUser, tab, handleChangeTab }) {
  const authUser = useAuthUser();

  const isAuthUsersProfile =
    authUser && authUser.username === profileUser?.username;

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
        <Tabs
          variant="scrollable"
          allowScrollButtonsMobile
          value={tab}
          onChange={(event, value) => handleChangeTab(value)}
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
      </Box>

      <TabPanel value={PROFILE_TABS.POSTS} tab={tab}>
        <PostList posts={profileUser.posts} />
      </TabPanel>

      <TabPanel value={PROFILE_TABS.COMMENTS} tab={tab}>
        <CommentList comments={profileUser.comments} />
      </TabPanel>

      <TabPanel value={PROFILE_TABS.FOLLOWING} tab={tab}>
        <FollowList
          profileUser={profileUser}
          users={profileUser.following}
          type="following"
        />
      </TabPanel>

      <TabPanel value={PROFILE_TABS.FOLLOWERS} tab={tab}>
        <FollowList
          profileUser={profileUser}
          users={profileUser.followers}
          type="follower"
        />
      </TabPanel>

      <TabPanel value={PROFILE_TABS.SAVED} tab={tab}>
        <PostList posts={profileUser.saved_posts} />
      </TabPanel>
    </>
  );
}

export default ProfileTabBar;
