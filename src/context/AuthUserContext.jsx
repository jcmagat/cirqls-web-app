import { createContext, useContext, useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_AUTH_USER } from "../graphql/queries";

const AuthUserContext = createContext();
const AuthUserUpdateContext = createContext();

export const useAuthUser = () => {
  return useContext(AuthUserContext);
};

export const useAuthUserUpdate = () => {
  return useContext(AuthUserUpdateContext);
};

// TODO: refresh token

export function AuthUserProvider(props) {
  const [user, setUser] = useState();

  const { data, refetch } = useQuery(GET_AUTH_USER, {
    onError: handleError,
  });

  useEffect(() => {
    if (data) {
      setUser(data.authUser);
    }
  }, [data]);

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
