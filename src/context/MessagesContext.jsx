import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { useQuery, useMutation } from "@apollo/client";
import { GET_CONVERSATIONS } from "../graphql/queries";
import { NEW_MESSAGE } from "../graphql/subscriptions";
import { SEND_MESSAGE } from "../graphql/mutations";

const ConversationsContext = createContext();
const MessagesContext = createContext();
const MessageSenderContext = createContext();

export const useConversations = () => {
  return useContext(ConversationsContext);
};

export const useMessages = () => {
  return useContext(MessagesContext);
};

export const useMessageSender = () => {
  return useContext(MessageSenderContext);
};

export function MessagesProvider(props) {
  const { search } = useLocation();
  const { user } = queryString.parse(search);

  const [messages, setMessages] = useState([]);

  /* ========== Get Conversations ========== */

  const [conversations, setConversations] = useState([]);

  const {
    data: getConversationsData,
    subscribeToMore,
    updateQuery,
  } = useQuery(GET_CONVERSATIONS);

  useEffect(() => {
    if (getConversationsData) {
      setConversations(getConversationsData.conversations);
    }
  }, [getConversationsData]);

  /* ========== Set Messages ========== */

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
            (conversation) =>
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

  const handleSendMessage = (message) => {
    if (!user) return;

    sendMessage({
      variables: {
        recipient: user,
        message: message,
      },
    });
  };

  function finishSendMessage(data) {
    const myMessage = data.sendMessage;

    updateQuery((prev) => {
      let updatedConversations = [];

      const index = prev.conversations.findIndex(
        (conversation) =>
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
    <ConversationsContext.Provider value={conversations}>
      <MessagesContext.Provider value={messages}>
        <MessageSenderContext.Provider value={handleSendMessage}>
          {props.children}
        </MessageSenderContext.Provider>
      </MessagesContext.Provider>
    </ConversationsContext.Provider>
  );
}
