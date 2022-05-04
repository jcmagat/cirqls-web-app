import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_EXPLORE_PAGE_POSTS } from "../graphql/queries";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import NavBar from "../components/Navigation/NavBar";
import PostList from "../components/Post/PostList";
import SortSelect from "../components/Post/SortSelect";
import { SORT_TYPES } from "../components/Post/SortSelect";

function ExplorePage(props) {
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
    <Container>
      <NavBar />

      <Box sx={{ marginTop: 12, maxWidth: 800, marginInline: "auto" }}>
        <SortSelect sort={sort} handleChangeSort={handleChangeSort} />

        <PostList posts={posts} />
      </Box>
    </Container>
  );
}

export default ExplorePage;
