import React, { useState } from "react";
import { useProfileUser } from "../context/ProfileUserContext";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import NavBar from "../components/Navigation/NavBar";
import ProfileHeader from "../components/User/ProfileHeader";
import ProfileTabBar from "../components/User/ProfileTabBar";

export const PROFILE_TABS = {
  POSTS: "posts",
  COMMENTS: "comments",
  FOLLOWING: "following",
  FOLLOWERS: "followers",
  SAVED: "saved",
};

function ProfilePage(props) {
  const user = useProfileUser();

  const [tab, setTab] = useState(PROFILE_TABS.POSTS);

  const handleChangeTab = (newTab) => {
    setTab(newTab);
  };

  return (
    <Container>
      <NavBar />

      {user && (
        <Box
          sx={{
            marginTop: 12,
            marginBottom: 12,
            maxWidth: 800,
            marginInline: "auto",
          }}
        >
          <ProfileHeader handleChangeTab={handleChangeTab} />

          <ProfileTabBar tab={tab} handleChangeTab={handleChangeTab} />
        </Box>
      )}
    </Container>
  );
}

export default ProfilePage;
