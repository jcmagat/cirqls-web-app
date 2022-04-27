import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
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

const StyledBottomNavigation = styled(BottomNavigation)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "none",
  },
}));

function BottomNavBar(props) {
  const [tab, setTab] = useState(NAV_TABS.HOME);

  return (
    <AppBar sx={{ top: "auto", bottom: 0 }}>
      <StyledBottomNavigation
        value={tab}
        onChange={(event, newValue) => setTab(newValue)}
      >
        <BottomNavigationAction
          label={NAV_TABS.HOME}
          icon={<HomeOutlinedIcon />}
        />

        <BottomNavigationAction
          label={NAV_TABS.EXPLORE}
          icon={<SearchIcon />}
        />

        <BottomNavigationAction label={NAV_TABS.SUBMIT} icon={<AddIcon />} />

        <BottomNavigationAction
          label={NAV_TABS.MESSAGES}
          icon={<ChatOutlinedIcon />}
        />

        <BottomNavigationAction
          label={NAV_TABS.NOTIFICATIONS}
          icon={<NotificationsOutlinedIcon />}
        />
      </StyledBottomNavigation>
    </AppBar>
  );
}

export default BottomNavBar;
