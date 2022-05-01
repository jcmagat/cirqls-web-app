import React from "react";
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

function BottomNavBar(props) {
  const unreadMessages = useUnreadMessages();
  const notifications = useNotifications();

  return (
    <AppBar color="inherit" sx={{ top: "auto", bottom: 0 }}>
      <Toolbar disableGutters sx={{ justifyContent: "space-evenly" }}>
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
          <Badge color="primary" badgeContent={unreadMessages.length}>
            <ChatOutlinedIcon />
          </Badge>
        </IconButton>

        <IconButton component={Link} href={"/"}>
          <Badge color="primary" badgeContent={notifications.length}>
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default BottomNavBar;
