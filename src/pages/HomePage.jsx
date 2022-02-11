import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useQuery } from "@apollo/client";
import { GET_HOME_PAGE_POSTS } from "../graphql/queries";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import NavBar from "../components/Navigation/NavBar";
import HomePageNav from "../components/Navigation/HomePageNav";
import PostList from "../components/Post/PostList";
import { MenuItem, TextField, Typography } from "@material-ui/core";

const useStyles = makeStyles({
  postCards: {
    marginTop: 80,
  },
  sort: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
});

function HomePage(props) {
  const classes = useStyles();

  const [displayNav, setDisplayNav] = useState(false);
  const [posts, setPosts] = useState([]);
  const [sort, setSort] = useState("new");

  const { data } = useQuery(GET_HOME_PAGE_POSTS);

  useEffect(() => {
    if (!data) return;

    setPosts(data.homePagePosts);

    if (data.homePagePosts.length === 0) {
      setDisplayNav(true);
    } else {
      setDisplayNav(false);
    }
  }, [data]);

  return (
    <Container component="main">
      <NavBar />

      <Paper className={classes.postCards} elevation={0}>
        {displayNav ? (
          <HomePageNav />
        ) : (
          <Paper elevation={0}>
            <Paper className={classes.sort} elevation={0}>
              <Typography>Sort :</Typography>
              <TextField
                select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
              >
                <MenuItem value={"new"}>New</MenuItem>
                <MenuItem value={"top"}>Top</MenuItem>
              </TextField>
            </Paper>

            <PostList posts={posts} />
          </Paper>
        )}
      </Paper>
    </Container>
  );
}

export default HomePage;
