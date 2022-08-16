import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { useQuery } from "@apollo/client";
import { SEARCH } from "../graphql/queries";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import NavBar from "../components/Navigation/NavBar";
import PostList from "../components/Post/PostList";
import CommunityCard from "../components/Community/CommunityCard";
import UserCard from "../components/User/UserCard";

const TABS = {
  POSTS: "posts",
  COMMUNITIES: "communities",
  USERS: "users",
};

function SearchPage() {
  const { search } = useLocation();
  const { term } = queryString.parse(search);

  const [tab, setTab] = useState(TABS.POSTS);

  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [users, setUsers] = useState([]);

  const { data } = useQuery(SEARCH, {
    variables: {
      term: term,
    },
  });

  useEffect(() => {
    if (!data) return;

    setPosts(
      data.search.filter(
        (result: any) =>
          result.__typename === "TextPost" || result.__typename === "MediaPost"
      )
    );

    setCommunities(
      data.search.filter((result: any) => result.__typename === "Community")
    );

    setUsers(data.search.filter((result: any) => result.__typename === "User"));
  }, [data]);

  return (
    <Container>
      <NavBar elevation={3} bottomOnly={false} />

      <Box
        sx={{
          marginTop: 12,
          marginBottom: 12,
          maxWidth: 800,
          marginInline: "auto",
        }}
      >
        <Typography variant="h6">{`Search results for "${term}"`}</Typography>

        <TabContext value={tab}>
          <TabList
            centered={true}
            indicatorColor="primary"
            onChange={(event, value) => setTab(value)}
          >
            <Tab label="Posts" value={TABS.POSTS} />
            <Tab label="Communities" value={TABS.COMMUNITIES} />
            <Tab label="Users" value={TABS.USERS} />
          </TabList>

          <TabPanel value={TABS.POSTS}>
            <PostList posts={posts} />
          </TabPanel>

          <TabPanel value={TABS.COMMUNITIES}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {communities.map((community: any) => (
                <CommunityCard
                  key={community.community_id}
                  community={community}
                />
              ))}
            </Box>
          </TabPanel>

          <TabPanel value={TABS.USERS}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {users.map((user: any) => (
                <UserCard key={user.user_id} user={user} />
              ))}
            </Box>
          </TabPanel>
        </TabContext>
      </Box>
    </Container>
  );
}

export default SearchPage;
