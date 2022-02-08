import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useQuery } from "@apollo/client";
import { GET_EXPLORE_PAGE_POSTS } from "../graphql/queries";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import NavBar from "../components/Navigation/NavBar";
import PostList from "../components/Post/PostList";

const useStyles = makeStyles({
  postCards: {
    marginTop: 80,
  },
});

function ExplorePage(props) {
  const classes = useStyles();

  const [posts, setPosts] = useState([]);

  const { data } = useQuery(GET_EXPLORE_PAGE_POSTS);

  useEffect(() => {
    if (data) {
      setPosts(data.explorePagePosts);
    }
  }, [data]);

  return (
    <Container component="main">
      <NavBar />

      <Paper className={classes.postCards} elevation={0}>
        <PostList posts={posts} />
      </Paper>
    </Container>
  );
}

export default ExplorePage;
