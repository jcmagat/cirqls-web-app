import React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import NavBar from "../components/Navigation/NavBar";
import ConversationList from "../components/Message/ConversationList";
import MessageArea from "../components/Message/MessageArea";

function MessagesPage(props) {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const topNavBarHeight = 64;
  const bottomNavBarHeight = isSmallScreen ? 64 : 0;
  const dividersHeight = isSmallScreen ? 2 : 1;

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        height: "100vh",
        paddingTop: topNavBarHeight / 8,
        paddingBottom: bottomNavBarHeight / 8,
      }}
    >
      <NavBar elevation={0} />

      <Divider />

      <Box
        sx={{
          height: `calc(100% - ${dividersHeight}px)`,
          display: "flex",
          flexDirection: "row",
        }}
      >
        <ConversationList
          sx={{ width: 300, display: isSmallScreen ? "none" : "block" }}
        />

        <Divider
          orientation="vertical"
          sx={{ display: isSmallScreen ? "none" : "block" }}
        />

        <MessageArea sx={{ flexGrow: 1 }} />
      </Box>

      <Divider sx={{ display: isSmallScreen ? "block" : "none" }} />
    </Container>
  );
}

export default MessagesPage;
