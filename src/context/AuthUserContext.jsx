import React, { createContext, useContext, useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_AUTH_USER } from "../graphql/queries";

const AuthUserContext = createContext();
const AuthUserUpdateContext = createContext();

export const useAuthUser = () => {
  return useContext(AuthUserContext);
};

export const useAuthUserUpdate = () => {
  return useContext(AuthUserUpdateContext);
};

export function AuthUserProvider(props) {
  const [user, setUser] = useState();

  const [getAuthUser, { data, refetch }] = useLazyQuery(GET_AUTH_USER, {
    onError: handleError,
  });

  useEffect(() => {
    if (Boolean(localStorage.getItem("token"))) {
      getAuthUser();
    }

    if (data) {
      setUser(data.authUser);
    }
  }, [getAuthUser, data]);

  function handleError(error) {
    console.error(error.message);
  }

  const handleUpdate = () => {
    if (refetch) {
      refetch();
    }
  };

  return (
    <AuthUserContext.Provider value={user}>
      <AuthUserUpdateContext.Provider value={handleUpdate}>
        {props.children}
      </AuthUserUpdateContext.Provider>
    </AuthUserContext.Provider>
  );
}
