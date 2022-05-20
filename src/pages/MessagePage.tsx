import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { useQuery } from "@apollo/client";
import { GET_CONVERSATIONS } from "../graphql/queries";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Theme } from "@mui/material";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import NavBar from "../components/Navigation/NavBar";
import ConversationList from "../components/Message/ConversationList";
import MessageArea from "../components/Message/MessageArea";

function MessagesPage() {
  const { search } = useLocation();
  const { user } = queryString.parse(search);

  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  const topNavBarHeight = isSmallScreen ? 0 : 64;
  const bottomNavBarHeight = isSmallScreen ? 64 : 0;
  const dividersHeight = isSmallScreen ? 2 : 1;

  /* ========== Get Conversations ========== */

  const [conversations, setConversations] = useState([]);

  const { data, subscribeToMore, updateQuery } = useQuery(GET_CONVERSATIONS);

  useEffect(() => {
    if (data) {
      setConversations(data.conversations);
    }
  }, [data]);

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
      <NavBar elevation={0} bottomOnly={isSmallScreen} />

      <Divider />

      <Box
        sx={{
          height: `calc(100% - ${dividersHeight}px)`,
          display: "flex",
          flexDirection: "row",
        }}
      >
        {isSmallScreen ? (
          <>
            {user ? (
              <MessageArea showNav user={user} sx={{ flexGrow: 1 }} />
            ) : (
              <ConversationList sx={{ flexGrow: 1 }} />
            )}
          </>
        ) : (
          <>
            <ConversationList sx={{ width: 300 }} />

            <Divider orientation="vertical" />

            <MessageArea showNav={false} user={user} sx={{ flexGrow: 1 }} />
          </>
        )}
      </Box>

      <Divider sx={{ display: isSmallScreen ? "block" : "none" }} />
    </Container>
  );
}

export default MessagesPage;
