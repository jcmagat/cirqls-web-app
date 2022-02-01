import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useAuthUser } from "../../context/AuthUserContext";
import Paper from "@material-ui/core/Paper";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Popover from "@material-ui/core/Popover";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import TollIcon from "@material-ui/icons/Toll";
import ChatOutlinedIcon from "@material-ui/icons/ChatOutlined";
import AddIcon from "@material-ui/icons/Add";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import ExitToAppOutlinedIcon from "@material-ui/icons/ExitToAppOutlined";
import { Link } from "react-router-dom";

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

  const handleSignUpClick = () => {
    console.log("signup");
  };

  return (
    <Paper>
      <AppBar color="inherit">
        <Toolbar>
          <IconButton edge="start" color="inherit" component={Link} to={"/"}>
            <TollIcon fontSize="large" />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Cirqls
          </Typography>

          {isLoggedIn ? (
            <Paper elevation={0}>
              <IconButton component={Link} to={"/submit"}>
                <AddIcon />
              </IconButton>

              <IconButton component={Link} to={"/messages"}>
                <ChatOutlinedIcon />
              </IconButton>

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
                    <Typography>Log Out</Typography>
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
                onClick={handleSignUpClick}
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
