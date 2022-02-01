import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import CommunityPage from "./pages/CommunityPage";
import SubmitPage from "./pages/SubmitPage";
import PostPage from "./pages/PostPage";
import MessagePage from "./pages/MessagePage";
import NotFoundPage from "./pages/NotFoundPage";
import { ProfileUserProvider } from "./context/ProfileUserContext";
import { CommunityProvider } from "./context/CommunityContext";
import { MessagesProvider } from "./context/MessagesContext";

function App() {
  return (
    <BrowserRouter forceRefresh={true}>
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>

        <Route path="/login">
          <LoginPage />
        </Route>

        <Route path="/signup/:token">
          <SignupPage />
        </Route>

        <Route path="/profile/:username">
          <ProfileUserProvider>
            <ProfilePage />
          </ProfileUserProvider>
        </Route>

        <Route path="/community/:name">
          <CommunityProvider>
            <CommunityPage />
          </CommunityProvider>
        </Route>

        <Route path="/submit">
          <SubmitPage />
        </Route>

        <Route path="/post/:id">
          <PostPage />
        </Route>

        <Route path="/messages">
          <MessagesProvider>
            <MessagePage />
          </MessagesProvider>
        </Route>

        <Route>
          <NotFoundPage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
