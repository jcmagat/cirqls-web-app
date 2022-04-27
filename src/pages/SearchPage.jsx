import React, { useState, useEffect } from "react";
import makeStyles from '@mui/styles/makeStyles';
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { useQuery } from "@apollo/client";
import { SEARCH } from "../graphql/queries";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import NavBar from "../components/Navigation/NavBar";
import PostList from "../components/Post/PostList";
import CommunityCard from "../components/Community/CommunityCard";
import UserCard from "../components/User/UserCard";

const useStyles = makeStyles({
  content: {
    marginTop: 80,
  },
  cards: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
});

const TABS = {
  POSTS: "posts",
  COMMUNITIES: "communities",
  USERS: "users",
};

function SearchPage(props) {
  const classes = useStyles();

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
        (result) =>
          result.__typename === "TextPost" || result.__typename === "MediaPost"
      )
    );

    setCommunities(
      data.search.filter((result) => result.__typename === "Community")
    );

    setUsers(data.search.filter((result) => result.__typename === "User"));
  }, [data]);

  return (
    <Container>
      <NavBar />

      <Paper className={classes.content} elevation={0}>
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
            <Paper className={classes.cards} elevation={0}>
              {communities.map((community) => (
                <CommunityCard
                  key={community.community_id}
                  community={community}
                />
              ))}
            </Paper>
          </TabPanel>

          <TabPanel value={TABS.USERS}>
            <Paper className={classes.cards} elevation={0}>
              {users.map((user) => (
                <UserCard key={user.user_id} user={user} />
              ))}
            </Paper>
          </TabPanel>
        </TabContext>
      </Paper>
    </Container>
  );
}

export default SearchPage;
