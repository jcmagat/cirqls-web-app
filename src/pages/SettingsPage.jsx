import React from "react";
import { makeStyles } from "@material-ui/core";
import { useAuthUser } from "../context/AuthUserContext";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import NavBar from "../components/Navigation/NavBar";
import ChangeEmailForm from "../components/Settings/ChangeEmailForm";
import ChangePasswordForm from "../components/Settings/ChangePasswordForm";
import ChangeUsernameForm from "../components/Settings/ChangeUsernameForm";
import DeleteAccountForm from "../components/Settings/DeleteAccountForm";

const useStyles = makeStyles({
  paper: {
    marginTop: 80,
  },
  settings: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  setting: {
    display: "flex",
    justifyContent: "space-between",
  },
  buttonPaper: {
    display: "flex",
    alignItems: "center",
    marginRight: 16,
  },
});

function SettingsPage(props) {
  const classes = useStyles();

  const authUser = useAuthUser();

  return (
    <Container>
      <NavBar />

      <Paper className={classes.paper} elevation={0}>
        {authUser && (
          <Paper className={classes.settings} elevation={0}>
            <Typography variant="h6">Account Settings</Typography>

            <Divider />

            <ChangeEmailForm />

            <ChangeUsernameForm />

            <ChangePasswordForm />

            <DeleteAccountForm />
          </Paper>
        )}
      </Paper>
    </Container>
  );
}

export default SettingsPage;
