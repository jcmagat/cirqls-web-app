import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_AUTH_USER } from "../graphql/queries";

const AuthUserContext = createContext();

export const useAuthUser = () => {
  return useContext(AuthUserContext);
};

export function AuthUserProvider(props) {
  const [user, setUser] = useState();

  const { data } = useQuery(GET_AUTH_USER);

  useEffect(() => {
    if (data) {
      setUser(data.authUser);
    }
  }, [data]);

  return (
    <AuthUserContext.Provider value={user}>
      {props.children}
    </AuthUserContext.Provider>
  );
}
