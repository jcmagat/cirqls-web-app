import { BrowserRouter, Switch, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import SubmitPage from "./pages/SubmitPage";
import PostPage from "./pages/PostPage";
import NotFoundPage from "./pages/NotFoundPage";
import {
  createHttpLink,
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

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

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter forceRefresh={true}>
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/signup">
            <SignupPage />
          </Route>
          <Route path="/submit">
            <SubmitPage />
          </Route>
          <Route path="/post/:id">
            <PostPage />
          </Route>
          <Route>
            <NotFoundPage />
          </Route>
        </Switch>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
