import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_HOME_PAGE_POSTS } from "../graphql/queries";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import NavBar from "../components/Navigation/NavBar";
import HomePageNav from "../components/Navigation/HomePageNav";
import PostList from "../components/Post/PostList";
import SortSelect from "../components/Post/SortSelect";
import { SORT_TYPES } from "../components/Post/SortSelect";

function HomePage(props) {
  const [displayNav, setDisplayNav] = useState(false);
  const [posts, setPosts] = useState([]);
  const [sort, setSort] = useState(SORT_TYPES.HOT);

  const { data, loading } = useQuery(GET_HOME_PAGE_POSTS, {
    variables: {
      sort: sort,
    },
  });

  useEffect(() => {
    if (!data) return;

    setPosts(data.homePagePosts);

    if (data.homePagePosts?.length === 0) {
      setDisplayNav(true);
    } else {
      setDisplayNav(false);
    }
  }, [data]);

  const handleChangeSort = (sort) => {
    setSort(sort);
  };

  return (
    <Container>
      <NavBar />

      <Box
        sx={{
          marginTop: 12,
          marginBottom: 12,
          maxWidth: 800,
          marginInline: "auto",
        }}
      >
        {displayNav ? (
          <HomePageNav />
        ) : (
          <>
            <SortSelect
              sort={sort}
              handleChangeSort={handleChangeSort}
              disabled={loading}
            />

            <PostList posts={posts} loading={loading} />
          </>
        )}
      </Box>
    </Container>
  );
}

export default HomePage;
