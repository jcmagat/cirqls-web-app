import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Popover from "@material-ui/core/Popover";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import DashboardIcon from "@material-ui/icons/Dashboard";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import ExitToAppOutlinedIcon from "@material-ui/icons/ExitToAppOutlined";
import { Link } from "react-router-dom";
import { useAuthUser } from "../context/AuthUserContext";

const useStyles = makeStyles({
  title: {
    flexGrow: 1,
  },
  leftButton: {
    marginRight: 8,
  },
});

function NavBar(props) {
  const classes = useStyles();
  const history = useHistory();

  const authUser = useAuthUser();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [accountMenuAnchor, setAccountMenuAnchor] = useState(null);

  useEffect(() => {
    setIsLoggedIn(Boolean(authUser));
  }, [authUser]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    history.push("/");
  };

  const handleAccountMenuOpen = (event) => {
    setAccountMenuAnchor(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAccountMenuAnchor(null);
  };

  return (
    <Paper>
      <AppBar color="inherit">
        <Toolbar>
          <IconButton edge="start" color="inherit" component={Link} to={"/"}>
            <DashboardIcon fontSize="large" />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Cirqls
          </Typography>

          {isLoggedIn ? (
            <Paper elevation={0}>
              <Button
                className={classes.leftButton}
                variant="contained"
                color="primary"
                component={Link}
                to={"/submit"}
              >
                Create a New Post
              </Button>

              <IconButton onClick={handleAccountMenuOpen}>
                <AccountCircleIcon fontSize="large" />
              </IconButton>
              <Popover
                open={Boolean(accountMenuAnchor)}
                anchorEl={accountMenuAnchor}
                onClose={handleAccountMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <ButtonGroup orientation="vertical">
                  <IconButton
                    component={Link}
                    to={`/profile/${authUser.username}`}
                  >
                    <AccountCircleOutlinedIcon />
                    <Typography>Profile</Typography>
                  </IconButton>

                  <IconButton onClick={handleLogout}>
                    <ExitToAppOutlinedIcon />
                    <Typography>Logout</Typography>
                  </IconButton>
                </ButtonGroup>
              </Popover>
            </Paper>
          ) : (
            <Paper elevation={0}>
              <Button
                className={classes.leftButton}
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
