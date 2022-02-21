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
import Avatar from "@material-ui/core/Avatar";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import ExitToAppOutlinedIcon from "@material-ui/icons/ExitToAppOutlined";
import SignUpDialog from "./SignUpDialog";
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

  useEffect(() => {
    setIsLoggedIn(Boolean(authUser));
  }, [authUser]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    history.push("/");
  };

  /* ========== Account Menu ========== */

  const [accountMenuAnchor, setAccountMenuAnchor] = useState(null);

  const handleAccountMenuOpen = (event) => {
    setAccountMenuAnchor(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAccountMenuAnchor(null);
  };

  /* ========== Sign Up ========== */

  const [signUpDialogOpen, setSignUpDialogOpen] = useState(false);

  const handleOpenSignUpDialog = () => {
    setSignUpDialogOpen(true);
  };

  const handleCloseSignUpDialog = () => {
    setSignUpDialogOpen(false);
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
                <Avatar src={authUser.profile_pic_src} />
                <ExpandMoreIcon />
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
                  <IconButton component={Link} to={`/u/${authUser.username}`}>
                    <AccountCircleOutlinedIcon />
                    <Typography>Profile</Typography>
                  </IconButton>

                  <IconButton component={Link} to={"/settings"}>
                    <SettingsOutlinedIcon />
                    <Typography>Settings</Typography>
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
                onClick={handleOpenSignUpDialog}
              >
                Sign Up
              </Button>

              <SignUpDialog
                open={signUpDialogOpen}
                onClose={handleCloseSignUpDialog}
              />
            </Paper>
          )}
        </Toolbar>
      </AppBar>
    </Paper>
  );
}

export default NavBar;
