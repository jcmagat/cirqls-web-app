import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_COMMUNITY } from "../graphql/queries";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import NavBar from "../components/NavBar";
import CommunityHeader from "../components/CommunityHeader";
import CommunityTabBar from "../components/CommunityTabBar";

const useStyles = makeStyles({
  paper: {
    marginTop: 80,
  },
});

export const COMMUNITY_TABS = {
  POSTS: "posts",
  ABOUT: "about",
};

function CommunityPage(props) {
  const classes = useStyles();

  const name = useParams().name;

  const [community, setCommunity] = useState();

  const { data } = useQuery(GET_COMMUNITY, { variables: { name: name } });

  useEffect(() => {
    if (data) {
      setCommunity(data.community);
    }
  }, [data]);

  const [tab, setTab] = useState("posts");

  const handleChangeTab = (newTab) => {
    setTab(newTab);
  };

  return (
    <Container>
      <NavBar />

      {community && (
        <Paper className={classes.paper} elevation={0}>
          <CommunityHeader community={community} />

          <CommunityTabBar
            tab={tab}
            handleChangeTab={handleChangeTab}
            posts={community.posts}
          />
        </Paper>
      )}
    </Container>
  );
}

export default CommunityPage;
