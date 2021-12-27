import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import NavBar from "../components/NavBar";
import PostList from "../components/PostList";
import { useQuery } from "@apollo/client";
import { GET_POSTS } from "../graphql/queries";

const useStyles = makeStyles({
  postCards: {
    marginTop: 80,
  },
});

function HomePage(props) {
  const classes = useStyles();

  const [posts, setPosts] = useState([]);

  // eslint-disable-next-line
  const { loading, error, data } = useQuery(GET_POSTS);

  useEffect(() => {
    if (data) {
      setPosts(data.posts);
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

export default HomePage;
