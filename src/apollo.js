import { ApolloClient, InMemoryCache, split } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

// const subscriptionUri = "ws://localhost:8080/subscriptions";
const subscriptionUri =
  "wss://cirqls-backend-production.up.railway.app/subscriptions";

// Apollo Terminating Link, similar to HttpLink
const uploadLink = createUploadLink({
  uri: "/graphql",
  credentials: "same-origin",
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach((error) => {
      console.log(
        `[GraphQL error]: Message: ${error.message}, Path: ${error.path}`
      );

      if (error.extensions.code === "UNAUTHENTICATED") {
        console.log("TODO: Either redirect to /login or show a popup");
      }
    });

  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

const wsLink = new WebSocketLink({
  uri: subscriptionUri,
  options: {
    reconnect: true,
    connectionParams: {},
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  errorLink.concat(authLink.concat(uploadLink))
);

const cache = new InMemoryCache({
  possibleTypes: {
    Post: ["TextPost", "MediaPost"],
  },
  typePolicies: {
    User: {
      keyFields: ["user_id"],
      fields: {
        followers: {
          merge: false,
        },
      },
    },
    Community: {
      keyFields: ["community_id"],
      fields: {
        members: {
          merge: false,
        },
      },
    },
    Post: {
      keyFields: ["post_id"],
    },
    Comment: {
      keyFields: ["comment_id"],
    },
    Message: {
      keyFields: ["message_id"],
    },
  },
});

export const client = new ApolloClient({
  link: splitLink,
  cache: cache,
  defaultOptions: {
    query: {
      errorPolicy: "all",
    },
  },
});
