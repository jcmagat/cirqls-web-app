import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_NOTIFICATIONS } from "../graphql/queries";

const NotificationsContext = createContext();

export const useNotifications = () => {
  return useContext(NotificationsContext);
};

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const { data } = useQuery(GET_NOTIFICATIONS);

  useEffect(() => {
    if (!data) return;

    setNotifications(data.notifications);
  }, [data]);

  return (
    <NotificationsContext.Provider value={notifications}>
      {children}
    </NotificationsContext.Provider>
  );
}
