import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_USER } from "../graphql/queries";
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

function ProfilePage() {
  const username = useParams().username;

  const [user, setUser] = useState();

  const { data } = useQuery(GET_USER, {
    variables: {
      username: username,
    },
    errorPolicy: "all",
    onError: handleError,
  });

  useEffect(() => {
    if (data) {
      setUser(data.user);
    }
  }, [data]);

  function handleError(error) {
    console.error(error.message);
  }

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
          <ProfileHeader user={user} handleChangeTab={handleChangeTab} />

          <ProfileTabBar
            user={user}
            tab={tab}
            handleChangeTab={handleChangeTab}
          />
        </Box>
      )}
    </Container>
  );
}

export default ProfilePage;
