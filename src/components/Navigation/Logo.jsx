import React from "react";
import { makeStyles } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import TollIcon from "@material-ui/icons/Toll";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  logo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});

function Logo(props) {
  const classes = useStyles();

  return (
    <Paper className={classes.logo} elevation={0}>
      <IconButton edge="start" color="inherit" component={Link} to={"/"}>
        <TollIcon fontSize="large" />
      </IconButton>
      <Typography variant="h6">Cirqls</Typography>
    </Paper>
  );
}

export default Logo;
