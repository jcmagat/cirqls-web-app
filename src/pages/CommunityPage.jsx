import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_COMMUNITY } from "../graphql/queries";
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

function CommunityPage() {
  const name = useParams().name;

  const [community, setCommunity] = useState();
  const [tab, setTab] = useState(TABS.POSTS);

  const { data } = useQuery(GET_COMMUNITY, {
    variables: { name: name },
  });

  useEffect(() => {
    if (data) {
      setCommunity(data.community);
    }
  }, [data]);

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
          <CommunityHeader community={community} />

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
            <CommunityAbout community={community} />
          </TabPanel>
        </Box>
      )}
    </Container>
  );
}

export default CommunityPage;
