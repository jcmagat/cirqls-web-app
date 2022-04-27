import React from "react";
import makeStyles from '@mui/styles/makeStyles';
import { useAuthUser } from "../context/AuthUserContext";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
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
