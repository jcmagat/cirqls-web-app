import React from "react";
import makeStyles from '@mui/styles/makeStyles';
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import TollIcon from "@mui/icons-material/Toll";
import Typography from "@mui/material/Typography";
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
      <IconButton edge="start" color="inherit" component={Link} to={"/"} size="large">
        <TollIcon fontSize="large" />
      </IconButton>
      <Typography variant="h6">Cirqls</Typography>
    </Paper>
  );
}

export default Logo;
