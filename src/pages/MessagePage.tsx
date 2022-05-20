import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { useQuery, useMutation } from "@apollo/client";
import { GET_CONVERSATIONS } from "../graphql/queries";
import { NEW_MESSAGE } from "../graphql/subscriptions";
import { SEND_MESSAGE } from "../graphql/mutations";
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

  const [conversations, setConversations] = useState<any[]>([]);

  const { data, subscribeToMore, updateQuery } = useQuery(GET_CONVERSATIONS);

  useEffect(() => {
    if (data) {
      setConversations(data.conversations);
    }
  }, [data]);

  /* ========== Set Messages ========== */

  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const conversation = conversations.find((el) => el.user.username === user);

    if (conversation) {
      setMessages(conversation.messages);
    } else {
      setMessages([]);
    }
  }, [user, conversations]);

  /* ========== Receive New Message ========== */

  useEffect(() => {
    const subscribeToNewMessage = () => {
      subscribeToMore({
        document: NEW_MESSAGE,
        updateQuery: (prev, { subscriptionData: { data } }) => {
          if (!data) return prev;

          const newMessage = data.newMessage;

          let updatedConversations = [];

          const index = prev.conversations.findIndex(
            (conversation: any) =>
              conversation.user.user_id === newMessage.sender.user_id
          );

          if (index > -1) {
            updatedConversations = [...prev.conversations];

            let conversation = updatedConversations.splice(index, 1)[0];

            conversation = Object.assign({}, conversation, {
              messages: [newMessage, ...conversation.messages],
            });

            updatedConversations.unshift(conversation);
          } else {
            const newConversation = {
              user: newMessage.sender,
              messages: [newMessage],
            };

            updatedConversations = [newConversation, ...prev.conversations];
          }

          return Object.assign({}, prev, {
            conversations: updatedConversations,
          });
        },
      });
    };

    subscribeToNewMessage();
  }, [subscribeToMore]);

  /* ========== Send Message ========== */

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onCompleted: finishSendMessage,
  });

  const handleSendMessage = (message: string) => {
    if (!user || !message) return;

    sendMessage({
      variables: {
        recipient: user,
        message: message,
      },
    });
  };

  function finishSendMessage(data: any) {
    const myMessage = data.sendMessage;

    updateQuery((prev) => {
      let updatedConversations = [];

      const index = prev.conversations.findIndex(
        (conversation: any) =>
          conversation.user.user_id === myMessage.recipient.user_id
      );

      if (index > -1) {
        updatedConversations = [...prev.conversations];

        let conversation = updatedConversations.splice(index, 1)[0];

        conversation = Object.assign({}, conversation, {
          messages: [myMessage, ...conversation.messages],
        });

        updatedConversations.unshift(conversation);
      } else {
        const newConversation = {
          user: myMessage.recipient,
          messages: [myMessage],
        };

        updatedConversations = [newConversation, ...prev.conversations];
      }

      return Object.assign({}, prev, { conversations: updatedConversations });
    });
  }

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
              <MessageArea
                user={user}
                messages={messages}
                onSendMessage={handleSendMessage}
                showNav
                sx={{ flexGrow: 1 }}
              />
            ) : (
              <ConversationList
                conversations={conversations}
                sx={{ flexGrow: 1 }}
              />
            )}
          </>
        ) : (
          <>
            <ConversationList
              conversations={conversations}
              sx={{ width: 300 }}
            />

            <Divider orientation="vertical" />

            <MessageArea
              user={user}
              messages={messages}
              onSendMessage={handleSendMessage}
              showNav={false}
              sx={{ flexGrow: 1 }}
            />
          </>
        )}
      </Box>

      <Divider sx={{ display: isSmallScreen ? "block" : "none" }} />
    </Container>
  );
}

export default MessagesPage;
