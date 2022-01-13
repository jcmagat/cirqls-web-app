import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import { useAuthUser } from "../context/AuthUserContext";
import { useMutation } from "@apollo/client";
import { JOIN, LEAVE } from "../graphql/mutations";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
  parentPaper: {
    display: "flex",
    justifyContent: "space-between",
  },
  logoPaper: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginLeft: 16,
  },
  buttonPaper: {
    display: "flex",
    alignItems: "center",
    marginRight: 16,
  },
});

function CommunityHeader(props) {
  const classes = useStyles();

  const authUser = useAuthUser();

  const [joined, setJoined] = useState(false);

  useEffect(() => {
    if (
      authUser &&
      props.community.members.some(
        (member) => member.username === authUser.username
      )
    ) {
      setJoined(true);
    } else {
      setJoined(false);
    }
  }, [authUser, props.community]);

  const [join] = useMutation(JOIN);
  const [leave] = useMutation(LEAVE);

  const handleJoin = () => {
    join({
      variables: {
        community_id: props.community.community_id,
      },
    });
  };

  const handleLeave = () => {
    leave({
      variables: {
        community_id: props.community.community_id,
      },
    });
  };

  const startedDate = new Date(props.community.created_at).toLocaleDateString(
    "en-us",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <Paper elevation={0}>
      <Paper className={classes.parentPaper} elevation={0}>
        <Paper className={classes.logoPaper} elevation={0}>
          <Avatar>{props.community.name.charAt(0).toUpperCase()}</Avatar>

          <Paper elevation={0}>
            <Typography variant="h5">{`${props.community.name}: ${props.community.title}`}</Typography>
            <Typography variant="body2">{`Started ${startedDate}`}</Typography>
            <Typography variant="body2">{`${props.community.members.length} members`}</Typography>
          </Paper>
        </Paper>

        <Paper className={classes.buttonPaper} elevation={0}>
          {joined ? (
            <Button variant="outlined" color="primary" onClick={handleLeave}>
              Joined
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleJoin}>
              Join
            </Button>
          )}
        </Paper>
      </Paper>
    </Paper>
  );
}

export default CommunityHeader;
