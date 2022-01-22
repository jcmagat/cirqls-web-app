import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  createHttpLink,
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { AuthUserProvider } from "./context/AuthUserContext";

const token = localStorage.getItem("token");

const httpLink = createHttpLink({
  uri: "/graphql",
  credentials: "same-origin",
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
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
  uri: "wss://cirqls-backend.herokuapp.com/subscriptions",
  options: {
    reconnect: true,
    connectionParams: {
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    },
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
  errorLink.concat(authLink.concat(httpLink))
);

const cache = new InMemoryCache({
  typePolicies: {
    User: {
      keyFields: ["username"],
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

const client = new ApolloClient({
  link: splitLink,
  cache: cache,
  defaultOptions: {
    query: {
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <AuthUserProvider>
      <App />
    </AuthUserProvider>
  </ApolloProvider>,
  document.getElementById("root")
);

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById("root")
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
