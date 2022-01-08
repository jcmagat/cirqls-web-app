import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_USER } from "../graphql/queries";

const ProfileUserContext = createContext();

export const useProfileUser = () => {
  return useContext(ProfileUserContext);
};

export function ProfileUserProvider(props) {
  const location = useLocation();
  const username = location.pathname.split("/")[2];

  const [user, setUser] = useState();

  const { data } = useQuery(GET_USER, {
    variables: {
      username: username,
    },
    errorPolicy: "all",
    onError: handleError,
  });

  useEffect(() => {
    if (data) {
      setUser(data.user);
    }
  }, [data]);

  function handleError(error) {
    console.error(error.message);
  }

  return (
    <ProfileUserContext.Provider value={user}>
      {props.children}
    </ProfileUserContext.Provider>
  );
}
