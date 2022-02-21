import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { useAuthUser } from "../context/AuthUserContext";
import { useMutation } from "@apollo/client";
import { CHANGE_USERNAME } from "../graphql/mutations";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import NavBar from "../components/Navigation/NavBar";

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
  twoButtons: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
  },
});

function SettingsPage(props) {
  const classes = useStyles();

  const authUser = useAuthUser();

  /* ========== Change Username ========== */

  const [isChangeUsernameMode, setIsChangeUsernameMode] = useState(false);
  const [newUsername, setNewUsername] = useState("");

  useEffect(() => {
    if (!authUser) return;

    setNewUsername(authUser.username);
  }, [authUser]);

  const [changeUsername, { loading: changeUsernameLoading }] = useMutation(
    CHANGE_USERNAME,
    {
      onCompleted: finishChangeUsername,
    }
  );

  const handleChangeUsername = () => {
    if (newUsername === authUser.username) {
      setIsChangeUsernameMode(false);
      return;
    }

    changeUsername({
      variables: {
        username: newUsername,
      },
    });
  };

  const handleChangeUsernameButtonClick = () => {
    setIsChangeUsernameMode(true);
  };

  const handleChangeUsernameCancel = () => {
    setNewUsername(authUser.username);
    setIsChangeUsernameMode(false);
  };

  function finishChangeUsername() {
    setIsChangeUsernameMode(false);
  }

  return (
    <Container>
      <NavBar />

      <Paper className={classes.paper} elevation={0}>
        {authUser && (
          <Paper className={classes.settings} elevation={0}>
            <Typography variant="h6">Account Settings</Typography>

            <Divider />

            <Paper className={classes.setting} elevation={0}>
              <Paper elevation={0}>
                <Typography variant="body1">Email Address</Typography>
                <Typography variant="body2">{authUser.email}</Typography>
              </Paper>

              <Paper className={classes.buttonPaper} elevation={0}>
                <Button variant="outlined" color="primary">
                  Change
                </Button>
              </Paper>
            </Paper>

            <Paper className={classes.setting} elevation={0}>
              <Paper elevation={0}>
                <Typography variant="body1">Username</Typography>
                {isChangeUsernameMode ? (
                  <TextField
                    variant="outlined"
                    size="small"
                    id="username"
                    label="Username"
                    autoFocus
                    value={newUsername}
                    onChange={(event) => setNewUsername(event.target.value)}
                    disabled={changeUsernameLoading}
                  />
                ) : (
                  <Typography variant="body2">{`u/${authUser.username}`}</Typography>
                )}
              </Paper>

              <Paper className={classes.buttonPaper} elevation={0}>
                {isChangeUsernameMode ? (
                  <Paper className={classes.twoButtons} elevation={0}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleChangeUsernameCancel}
                      disabled={changeUsernameLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleChangeUsername}
                      disabled={changeUsernameLoading}
                    >
                      Save
                    </Button>
                  </Paper>
                ) : (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleChangeUsernameButtonClick}
                  >
                    Change
                  </Button>
                )}
              </Paper>
            </Paper>

            <Paper className={classes.setting} elevation={0}>
              <Paper elevation={0}>
                <Typography variant="body1">Password</Typography>
                <Typography variant="body2">****************</Typography>
              </Paper>

              <Paper className={classes.buttonPaper} elevation={0}>
                <Button variant="outlined" color="primary">
                  Change
                </Button>
              </Paper>
            </Paper>
          </Paper>
        )}
      </Paper>
    </Container>
  );
}

export default SettingsPage;
