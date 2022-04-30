import React, { useState, useEffect } from "react";
import makeStyles from "@mui/styles/makeStyles";
import { useAuthUser } from "../context/AuthUserContext";
import { useQuery } from "@apollo/client";
import { GET_COMMUNITIES } from "../graphql/queries";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import NavBar from "../components/Navigation/NavBar";
import SubmitTabBar from "../components/Submit/SubmitTabBar";
import { COMMUNITY_TYPES } from "../utils/constants";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  paper: {
    marginTop: 80,
  },
  community: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: 24,
  },
  select: {
    minWidth: 160,
  },
});

function SubmitPage(props) {
  const classes = useStyles();

  const authUser = useAuthUser();

  const [communities, setCommunities] = useState([]);

  const { data, loading } = useQuery(GET_COMMUNITIES);

  useEffect(() => {
    if (!data || !authUser) return;

    // Only show:
    // public communities
    // restricted communities that authUser is a moderator of
    setCommunities(
      data.communities.filter(
        (community) =>
          community.type === COMMUNITY_TYPES.PUBLIC ||
          (community.type === COMMUNITY_TYPES.RESTRICTED &&
            community.moderators.some(
              (moderator) => moderator.user_id === authUser.user_id
            ))
      )
    );
  }, [data, authUser]);

  const [communityId, setCommunityId] = useState();

  return (
    <Container component="main" maxWidth="md">
      <NavBar />

      <Paper className={classes.paper} elevation={0}>
        <Paper className={classes.community} elevation={0}>
          <TextField
            className={classes.select}
            id="community"
            label="Community"
            select
            defaultValue={"0"}
            onChange={(event) => setCommunityId(parseInt(event.target.value))}
            disabled={loading}
          >
            <MenuItem value="0" disabled>
              Choose a community
            </MenuItem>
            {communities.map((community) => (
              <MenuItem
                key={community.community_id}
                value={community.community_id}
              >
                {community.name}
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant="outlined"
            color="primary"
            component={Link}
            to={"/create-community"}
          >
            Create A Community
          </Button>
        </Paper>

        <SubmitTabBar communityId={communityId} />
      </Paper>
    </Container>
  );
}

export default SubmitPage;
