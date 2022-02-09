import React from "react";
import { makeStyles } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
  },
});

function HomePageNav(props) {
  const classes = useStyles();

  return (
    <Paper className={classes.paper} elevation={0}>
      <Typography>
        This is where you'll see posts in circles that you're a member of
      </Typography>

      <Typography>
        Here are some circles that you may be interested in:
      </Typography>

      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/explore"
      >
        Explore
      </Button>
    </Paper>
  );
}

export default HomePageNav;
