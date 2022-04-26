import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useQuery } from "@apollo/client";
import { GET_EXPLORE_PAGE_POSTS } from "../graphql/queries";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import NavBar from "../components/Navigation/NavBar";
import PostList from "../components/Post/PostList";
import SortSelect from "../components/Post/SortSelect";
import { SORT_TYPES } from "../components/Post/SortSelect";

const useStyles = makeStyles({
  content: {
    marginTop: 80,
    maxWidth: 800,
    marginInline: "auto",
  },
});

function ExplorePage(props) {
  const classes = useStyles();

  const [posts, setPosts] = useState([]);
  const [sort, setSort] = useState(SORT_TYPES.HOT);

  const { data } = useQuery(GET_EXPLORE_PAGE_POSTS, {
    variables: {
      sort: sort,
    },
  });

  useEffect(() => {
    if (data) {
      setPosts(data.explorePagePosts);
    }
  }, [data]);

  const handleChangeSort = (sort) => {
    setSort(sort);
  };

  return (
    <Container component="main">
      <NavBar />

      <Paper className={classes.content} elevation={0}>
        <SortSelect sort={sort} handleChangeSort={handleChangeSort} />

        <PostList posts={posts} />
      </Paper>
    </Container>
  );
}

export default ExplorePage;
