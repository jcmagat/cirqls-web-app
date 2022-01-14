import React, { createContext, useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_COMMUNITY } from "../graphql/queries";

const CommunityContext = createContext();

export const useCommunity = () => {
  return useContext(CommunityContext);
};

export function CommunityProvider(props) {
  const name = useParams().name;

  const [community, setCommunity] = useState();

  const { data } = useQuery(GET_COMMUNITY, {
    variables: { name: name },
    onError: handleError,
  });

  useEffect(() => {
    if (data) {
      setCommunity(data.community);
    }
  }, [data]);

  function handleError(error) {
    console.error(error.message);
  }

  return (
    <CommunityContext.Provider value={community}>
      {props.children}
    </CommunityContext.Provider>
  );
}
