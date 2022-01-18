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
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { AuthUserProvider } from "./context/AuthUserContext";

const httpLink = createHttpLink({
  uri: "/graphql",
  credentials: "same-origin",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");

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
  },
});

const client = new ApolloClient({
  link: errorLink.concat(authLink.concat(httpLink)),
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
