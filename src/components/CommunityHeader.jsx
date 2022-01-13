import React from "react";
import { makeStyles } from "@material-ui/styles";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { Button } from "@material-ui/core";

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

function CommunityHeader({ community }) {
  const classes = useStyles();

  const startedDate = new Date(community.created_at).toLocaleDateString(
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
          <Avatar>{community.name.charAt(0).toUpperCase()}</Avatar>

          <Paper elevation={0}>
            <Typography variant="h5">{community.title}</Typography>
            <Typography variant="subtitle1">{`c/${community.name}`}</Typography>
            <Typography variant="body2">{`Started ${startedDate}`}</Typography>
          </Paper>
        </Paper>

        <Paper className={classes.buttonPaper} elevation={0}>
          <Button variant="contained" color="primary">
            Join
          </Button>
        </Paper>
      </Paper>
    </Paper>
  );
}

export default CommunityHeader;
