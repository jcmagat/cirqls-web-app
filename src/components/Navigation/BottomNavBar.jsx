import React from "react";
import { styled } from "@mui/material/styles";
import {
  useUnreadMessages,
  useNotifications,
} from "../../context/NotificationsContext";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Link from "@mui/material/Link";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";

const NAV_TABS = {
  HOME: "Home",
  EXPLORE: "Explore",
  SUBMIT: "Submit",
  MESSAGES: "Messages",
  NOTIFICATIONS: "Notifications",
};

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "none",
  },
}));

function BottomNavBar(props) {
  const unreadMessages = useUnreadMessages();
  const notifications = useNotifications();

  return (
    <StyledAppBar color="inherit" sx={{ top: "auto", bottom: 0 }}>
      <Toolbar sx={{ justifyContent: "space-evenly" }}>
        <IconButton component={Link} href={"/"}>
          <HomeOutlinedIcon />
        </IconButton>

        <IconButton component={Link} href={"/explore"}>
          <SearchIcon />
        </IconButton>

        <IconButton component={Link} href={"/submit"}>
          <AddIcon />
        </IconButton>

        <IconButton component={Link} href={"/messages"}>
          <Badge color="secondary" badgeContent={unreadMessages.length}>
            <ChatOutlinedIcon />
          </Badge>
        </IconButton>

        <IconButton component={Link} href={"/"}>
          <Badge color="secondary" badgeContent={notifications.length}>
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </StyledAppBar>
  );
}

export default BottomNavBar;
