import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import DashboardIcon from "@material-ui/icons/Dashboard";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  title: {
    flexGrow: 1,
  },
  loginButton: {
    marginRight: 8,
  },
});

function NavBar(props) {
  const classes = useStyles();

  return (
    <Paper>
      <AppBar color="inherit">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <DashboardIcon fontSize="large" />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Bulletin Board
          </Typography>
          {props.isLoggedIn ? (
            <Button
              variant="contained"
              color="primary"
              onClick={props.handleLogout}
            >
              Logout
            </Button>
          ) : (
            <Paper elevation={0}>
              <Button
                className={classes.loginButton}
                variant="outlined"
                color="primary"
                component={Link}
                to={"/login"}
              >
                Log In
              </Button>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to={"/signup"}
              >
                Sign Up
              </Button>
            </Paper>
          )}
        </Toolbar>
      </AppBar>
    </Paper>
  );
}

export default NavBar;
