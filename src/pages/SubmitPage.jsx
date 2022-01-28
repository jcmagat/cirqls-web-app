import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useQuery } from "@apollo/client";
import { GET_COMMUNITIES } from "../graphql/queries";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import NavBar from "../components/NavBar";
import SubmitTabBar from "../components/Submit/SubmitTabBar";

const useStyles = makeStyles({
  paper: {
    marginTop: 80,
  },
});

function SubmitPage(props) {
  const classes = useStyles();

  const [communities, setCommunities] = useState([]);

  const { data } = useQuery(GET_COMMUNITIES);

  useEffect(() => {
    if (data) {
      setCommunities(data.communities);
    }
  }, [data]);

  const [communityId, setCommunityId] = useState();

  return (
    <Container component="main" maxWidth="md">
      <NavBar />

      <Paper className={classes.paper} elevation={0}>
        <TextField
          id="community"
          label="Community"
          variant="outlined"
          select
          defaultValue={"0"}
          onChange={(event) => setCommunityId(parseInt(event.target.value))}
          // disabled={loading}
        >
          <MenuItem value="0" disabled>
            Community
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

        <SubmitTabBar communityId={communityId} />
      </Paper>
    </Container>
  );
}

export default SubmitPage;
