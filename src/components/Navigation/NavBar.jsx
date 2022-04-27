import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import makeStyles from "@mui/styles/makeStyles";
import { useAuthUser } from "../../context/AuthUserContext";
import { useUnreadMessages } from "../../context/NotificationsContext";
import Paper from "@mui/material/Paper";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Popover from "@mui/material/Popover";
import ButtonGroup from "@mui/material/ButtonGroup";
import TollIcon from "@mui/icons-material/Toll";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import AddIcon from "@mui/icons-material/Add";
import Avatar from "@mui/material/Avatar";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import SearchBar from "./SearchBar";
import SignUpDialog from "./SignUpDialog";
import NotificationsButton from "./NotificationsButton";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  titleAndSearch: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flexGrow: 1,
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
  },
});

function NavBar(props) {
  const classes = useStyles();
  const history = useHistory();

  const authUser = useAuthUser();
  const unreadMessages = useUnreadMessages();

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
          <IconButton
            edge="start"
            color="inherit"
            component={Link}
            to={"/"}
            size="large"
          >
            <TollIcon fontSize="large" />
          </IconButton>
          <Paper className={classes.titleAndSearch} elevation={0}>
            <Typography variant="h6">Cirqls</Typography>

            <SearchBar />
          </Paper>

          {isLoggedIn ? (
            <Paper elevation={0}>
              <IconButton component={Link} to={"/submit"} size="large">
                <AddIcon />
              </IconButton>

              <IconButton component={Link} to={"/messages"} size="large">
                <Badge color="secondary" badgeContent={unreadMessages.length}>
                  <ChatOutlinedIcon />
                </Badge>
              </IconButton>

              <NotificationsButton />

              <IconButton onClick={handleAccountMenuOpen} size="large">
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
                  <IconButton
                    component={Link}
                    to={`/u/${authUser.username}`}
                    size="large"
                  >
                    <AccountCircleOutlinedIcon />
                    <Typography>Profile</Typography>
                  </IconButton>

                  <IconButton component={Link} to={"/settings"} size="large">
                    <SettingsOutlinedIcon />
                    <Typography>Settings</Typography>
                  </IconButton>

                  <IconButton onClick={handleLogout} size="large">
                    <ExitToAppOutlinedIcon />
                    <Typography>Log Out</Typography>
                  </IconButton>
                </ButtonGroup>
              </Popover>
            </Paper>
          ) : (
            <Paper className={classes.buttons} elevation={0}>
              <Button
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
