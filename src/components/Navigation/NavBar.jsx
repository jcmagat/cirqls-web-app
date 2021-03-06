import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuthUser } from "../../context/AuthUserContext";
import { useUnreadMessages } from "../../context/NotificationsContext";
import { useMutation } from "@apollo/client";
import { LOGOUT } from "../../graphql/mutations";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import Divider from "@mui/material/Divider";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import AddIcon from "@mui/icons-material/Add";
import Avatar from "@mui/material/Avatar";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import StyledMenuItem from "../Common/StyledMenuItem";
import NotificationsButton from "./NotificationsButton";
import BottomNavBar from "./BottomNavBar";
import useMediaQuery from "@mui/material/useMediaQuery";

// Nav buttons for when the user is logged in
function AuthNavButtons({ screenSize }) {
  const history = useHistory();

  const authUser = useAuthUser();
  const unreadMessages = useUnreadMessages();

  const [anchorEl, setAnchorEl] = useState(null);

  const [logout] = useMutation(LOGOUT, {
    onCompleted: () => history.push("/"),
  });

  const handleLogout = () => {
    if (!authUser) return;

    logout();
  };

  return (
    <>
      {screenSize !== "small" && (
        <Box>
          <IconButton component={Link} href={"/submit"}>
            <AddIcon />
          </IconButton>

          <IconButton component={Link} href={"/messages"}>
            <Badge color="primary" badgeContent={unreadMessages.length}>
              <ChatOutlinedIcon />
            </Badge>
          </IconButton>

          <NotificationsButton />
        </Box>
      )}

      <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
        <Avatar src={authUser.profile_pic_src} />
        <ExpandMoreIcon />
      </IconButton>

      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        <StyledMenuItem component={Link} href={`/u/${authUser.username}`}>
          <AccountCircleOutlinedIcon />
          Profile
        </StyledMenuItem>

        <StyledMenuItem component={Link} href={"/settings"}>
          <SettingsOutlinedIcon />
          Settings
        </StyledMenuItem>

        <Divider />

        <StyledMenuItem onClick={handleLogout}>
          <LogoutIcon />
          Log Out
        </StyledMenuItem>
      </Menu>
    </>
  );
}

// Nav buttons for when the user is not logged in
function NonAuthNavButtons({ screenSize }) {
  const history = useHistory();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleSignUpClick = () => {
    history.push("/signup");
  };

  return (
    <>
      {screenSize === "small" ? (
        <>
          <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
            <Avatar />
            <ExpandMoreIcon />
          </IconButton>

          <Menu
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
          >
            <StyledMenuItem component={Link} href={"/login"}>
              <LoginIcon />
              Log In
            </StyledMenuItem>

            <StyledMenuItem onClick={handleSignUpClick}>
              <PersonAddAltIcon />
              Sign Up
            </StyledMenuItem>
          </Menu>
        </>
      ) : (
        <>
          <Button
            variant="outlined"
            color="primary"
            component={Link}
            href={"/login"}
          >
            Log In
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSignUpClick}
            sx={{ marginRight: 2 }}
          >
            Sign Up
          </Button>
        </>
      )}
    </>
  );
}

function NavBar({ elevation, bottomOnly }) {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const screenSize = isSmallScreen ? "small" : "normal";

  const authUser = useAuthUser();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(authUser));
  }, [authUser]);

  return (
    <>
      {!bottomOnly && (
        <AppBar
          color="inherit"
          elevation={Number.isInteger(elevation) ? elevation : 3}
        >
          <Toolbar disableGutters>
            <Logo size={screenSize} sx={{ paddingLeft: 2 }} />

            <SearchBar
              sx={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                minWidth: "40vw",
              }}
            />

            <Box
              sx={{
                marginLeft: "auto",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1,
              }}
            >
              {isLoggedIn ? (
                <AuthNavButtons screenSize={screenSize} />
              ) : (
                <NonAuthNavButtons screenSize={screenSize} />
              )}
            </Box>
          </Toolbar>
        </AppBar>
      )}

      {isSmallScreen && <BottomNavBar elevation={elevation} />}
    </>
  );
}

export default NavBar;
