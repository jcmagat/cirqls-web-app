import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_NOTIFICATIONS } from "../graphql/queries";
import { NEW_NOTIFICATION } from "../graphql/subscriptions";

const NotificationsContext = createContext();
const UnreadMessagesContext = createContext();

export const useNotifications = () => {
  return useContext(NotificationsContext);
};

export const useUnreadMessages = () => {
  return useContext(UnreadMessagesContext);
};

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState([]);

  const { data, subscribeToMore } = useQuery(GET_NOTIFICATIONS);

  useEffect(() => {
    if (!data) return;

    setNotifications(
      data.notifications.filter(
        (notification) => notification.__typename !== "Message"
      )
    );

    setUnreadMessages(
      data.notifications.filter(
        (notification) => notification.__typename === "Message"
      )
    );
  }, [data]);

  useEffect(() => {
    const subscribeToNewNotification = () => {
      subscribeToMore({
        document: NEW_NOTIFICATION,
        updateQuery: (prev, { subscriptionData: { data } }) => {
          if (!data) return prev;

          const updatedNotifications = [
            data.newNotification,
            ...prev.notifications,
          ];

          return Object.assign({}, prev, {
            notifications: updatedNotifications,
          });
        },
      });
    };

    subscribeToNewNotification();
  }, [subscribeToMore]);

  return (
    <NotificationsContext.Provider value={notifications}>
      <UnreadMessagesContext.Provider value={unreadMessages}>
        {children}
      </UnreadMessagesContext.Provider>
    </NotificationsContext.Provider>
  );
}
