import React from "react";
import makeStyles from '@mui/styles/makeStyles';
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
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
        This is where you'll see posts in communities you're a member of
      </Typography>

      <Typography>
        Here are some communities you may be interested in:
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
