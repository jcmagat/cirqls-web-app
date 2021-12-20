import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import PostCard from "../components/PostCard";
import NavBar from "../components/NavBar";
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
    <Paper elevation={0}>
      <NavBar />
      <Container className={classes.postCards}>
        <Grid container spacing={2} direction="column-reverse">
          {posts.map((post) => (
            <Grid item key={post.post_id}>
              <PostCard post={post} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Paper>
  );
}

export default HomePage;
