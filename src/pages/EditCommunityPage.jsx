import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { useCommunity } from "../context/CommunityContext";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import { Avatar, Button, Typography } from "@material-ui/core";
import NavBar from "../components/Navigation/NavBar";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  paper: {
    marginTop: 80,
  },
  avatar: {
    width: 80,
    height: 80,
  },
  moderator: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    width: "max-content",
  },
});

function EditCommunityPage(props) {
  const classes = useStyles();

  const community = useCommunity();

  const [logoSrc, setLogoSrc] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <Container>
      <NavBar />

      {community && (
        <Paper className={classes.paper} elevation={0}>
          <Avatar className={classes.avatar}>
            {community.name.charAt(0).toUpperCase()}
          </Avatar>

          <Typography>{community.name}</Typography>

          <Typography>{community.title}</Typography>

          <Typography>{community.description}</Typography>

          <Typography>Moderators:</Typography>

          {community.moderators.map((moderator) => (
            <Paper
              className={classes.moderator}
              elevation={0}
              component={Link}
              to={`/u/${moderator.username}`}
            >
              <Avatar src={moderator.profile_pic_src} />
              <Typography>{`u/${moderator.username}`}</Typography>
            </Paper>
          ))}

          <Button variant="contained" color="primary">
            + Invite
          </Button>

          <Button variant="outlined" color="secondary">
            Delete Circle
          </Button>
        </Paper>
      )}
    </Container>
  );
}

export default EditCommunityPage;
