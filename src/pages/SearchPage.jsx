import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { useQuery } from "@apollo/client";
import { SEARCH } from "../graphql/queries";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import NavBar from "../components/Navigation/NavBar";
import PostList from "../components/Post/PostList";

const useStyles = makeStyles({
  content: {
    marginTop: 80,
  },
});

function SearchPage(props) {
  const classes = useStyles();

  const { search } = useLocation();
  const { term } = queryString.parse(search);

  const [users, setUsers] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [posts, setPosts] = useState([]);

  const { data } = useQuery(SEARCH, {
    variables: {
      term: term,
    },
  });

  useEffect(() => {
    if (!data) return;

    data.search.forEach((result) => {
      if (result.__typename === "User") {
        setUsers((prev) => [...prev, result]);
      } else if (result.__typename === "Community") {
        setCommunities((prev) => [...prev, result]);
      } else {
        setPosts((prev) => [...prev, result]);
      }
    });
  }, [data]);

  return (
    <Container>
      <NavBar />

      <Paper className={classes.content} elevation={0}>
        <PostList posts={posts} />
      </Paper>
    </Container>
  );
}

export default SearchPage;
