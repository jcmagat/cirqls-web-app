import React, { createContext, useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useSubscription, useMutation } from "@apollo/client";
import { GET_CONVERSATION } from "../graphql/queries";
import { NEW_MESSAGE } from "../graphql/subscriptions";
import { SEND_MESSAGE } from "../graphql/mutations";

const MessagesContext = createContext();
const MessageSenderContext = createContext();

export const useMessages = () => {
  return useContext(MessagesContext);
};

export const useMessageSender = () => {
  return useContext(MessageSenderContext);
};

export function MessagesProvider(props) {
  const { username } = useParams();

  const [messages, setMessages] = useState([]);

  /* ========== Get Messages ========== */

  const { data: getConversationData } = useQuery(GET_CONVERSATION, {
    variables: {
      username: username,
    },
    onError: handleError,
  });

  useEffect(() => {
    if (getConversationData) {
      setMessages(getConversationData.conversation);
    }
  }, [getConversationData]);

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
    sendMessage({
      variables: {
        recipient: username,
        message: message,
      },
    });
  };

  /* ========== Error Handling, Etc. ========== */

  function handleError(error) {
    console.error(error.message);
  }

  return (
    <MessagesContext.Provider value={messages}>
      <MessageSenderContext.Provider value={handleSendMessage}>
        {props.children}
      </MessageSenderContext.Provider>
    </MessagesContext.Provider>
  );
}
