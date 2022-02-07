import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useAuthUser } from "../context/AuthUserContext";
import { useLazyQuery } from "@apollo/client";
import { GET_POSTS, GET_HOME_PAGE_POSTS } from "../graphql/queries";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import NavBar from "../components/Navigation/NavBar";
import PostList from "../components/Post/PostList";

const useStyles = makeStyles({
  postCards: {
    marginTop: 80,
  },
});

function HomePage(props) {
  const classes = useStyles();

  const authUser = useAuthUser();

  const [posts, setPosts] = useState([]);

  const [getPosts, { data: getPostsData }] = useLazyQuery(GET_POSTS);
  const [getHomePagePosts, { data: getHomePagePostsData }] =
    useLazyQuery(GET_HOME_PAGE_POSTS);

  useEffect(() => {
    if (!!authUser) {
      getHomePagePosts();

      if (!!getHomePagePostsData) {
        setPosts(getHomePagePostsData.homePagePosts);
      }
    } else {
      getPosts();

      if (!!getPostsData) {
        setPosts(getPostsData.posts);
      }
    }
  }, [
    authUser,
    getHomePagePosts,
    getHomePagePostsData,
    getPosts,
    getPostsData,
  ]);

  return (
    <Container component="main">
      <NavBar />

      <Paper className={classes.postCards} elevation={0}>
        <PostList posts={posts} />
      </Paper>
    </Container>
  );
}

export default HomePage;
