import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { useQuery, useSubscription, useMutation } from "@apollo/client";
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

  const { data: getConversationsData } = useQuery(GET_CONVERSATIONS);

  useEffect(() => {
    if (getConversationsData) {
      setConversations(getConversationsData.conversations);
    }
  }, [getConversationsData]);

  /* ========== Set Messages ========== */

  useEffect(() => {
    if (!user) return;

    const conversation = conversations.find((el) => el.user.username === user);

    if (conversation) {
      setMessages(conversation.messages);
    }
  }, [user, conversations]);

  /* ========== Receive New Message ========== */

  const { data: newMessageData } = useSubscription(NEW_MESSAGE);

  useEffect(() => {
    if (newMessageData) {
      setMessages((prevMessages) => [
        newMessageData.newMessage,
        ...prevMessages,
      ]);
    }
  }, [newMessageData]);

  /* ========== Send Message ========== */

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onCompleted: (data) =>
      setMessages((prevMessages) => [data.sendMessage, ...prevMessages]),
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
