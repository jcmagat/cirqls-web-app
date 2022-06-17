import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import LinkAccountPage from "./pages/LinkAccountPage";
import ProfilePage from "./pages/ProfilePage";
import CreateCommunityPage from "./pages/CreateCommunityPage";
import EditCommunityPage from "./pages/EditCommunityPage";
import CommunityPage from "./pages/CommunityPage";
import SubmitPage from "./pages/SubmitPage";
import PostPage from "./pages/PostPage";
import MessagePage from "./pages/MessagePage";
import SettingsPage from "./pages/SettingsPage";
import SearchPage from "./pages/SearchPage";
import NotFoundPage from "./pages/NotFoundPage";

const theme = createTheme({
  components: {
    MuiLink: {
      defaultProps: {
        color: "inherit",
        underline: "none",
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: "large",
      },
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter forceRefresh={true}>
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>

          <Route path="/explore">
            <ExplorePage />
          </Route>

          <Route path="/login">
            <LoginPage />
          </Route>

          <Route path="/signup">
            <SignUpPage />
          </Route>

          <Route path="/link-account/google">
            <LinkAccountPage />
          </Route>

          <Route path="/u/:username">
            <ProfilePage />
          </Route>

          <Route path="/create-community">
            <CreateCommunityPage />
          </Route>

          <Route path="/c/:name/edit">
            <EditCommunityPage />
          </Route>

          <Route path="/c/:name">
            <CommunityPage />
          </Route>

          <Route path="/submit">
            <SubmitPage />
          </Route>

          <Route path="/post/:id">
            <PostPage />
          </Route>

          <Route path="/messages">
            <MessagePage />
          </Route>

          <Route path="/settings">
            <SettingsPage />
          </Route>

          <Route path="/search">
            <SearchPage />
          </Route>

          <Route>
            <NotFoundPage />
          </Route>
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
