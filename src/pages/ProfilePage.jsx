import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import NavBar from "../components/NavBar";
import ProfileHeader from "../components/ProfileHeader";
import PostList from "../components/PostList";
import { useQuery } from "@apollo/client";
import { GET_USER } from "../graphql/queries";

const useStyles = makeStyles({
  paper: {
    marginTop: 80,
  },
});

function ProfilePage(props) {
  const location = useLocation();
  const username = location.pathname.split("/")[2];

  const classes = useStyles();

  const [user, setUser] = useState();
  const [posts, setPosts] = useState([]);

  const { data: getUserData } = useQuery(GET_USER, {
    variables: {
      username: username,
    },
  });

  useEffect(() => {
    if (getUserData) {
      setUser(getUserData.user);
      setPosts(getUserData.user.posts);
    }
  }, [getUserData]);

  return (
    <Container component="main">
      <NavBar />

      {user && (
        <Paper className={classes.paper} elevation={0}>
          <ProfileHeader user={user} />

          <PostList posts={posts} />
        </Paper>
      )}
    </Container>
  );
}

export default ProfilePage;
