import { useState, useEffect } from "react";
import { useAuthUser } from "../../context/AuthUserContext";
import { useMutation, ApolloError } from "@apollo/client";
import { CHANGE_USERNAME } from "../../graphql/mutations";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import StyledButtonBox from "./StyledButtonBox";

function ChangeUsernameForm() {
  const authUser = useAuthUser();

  const [isChangeMode, setIsChangeMode] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newUsernameError, setNewUsernameError] = useState("");

  // Resets the error message when the new username changes
  useEffect(() => {
    setNewUsernameError("");
  }, [newUsername]);

  useEffect(() => {
    if (!authUser) return;

    setNewUsername(authUser.username);
  }, [authUser]);

  const [changeUsername, { loading }] = useMutation(CHANGE_USERNAME, {
    onCompleted: finishChangeUsername,
    onError: handleError,
  });

  // Called when the save button is clicked
  const handleChangeUsername = () => {
    if (newUsernameError) return;

    if (!newUsername) {
      setNewUsernameError("Please provide a username");
      return;
    } else if (newUsername === authUser.username) {
      setIsChangeMode(false);
      return;
    }

    changeUsername({
      variables: {
        username: newUsername,
      },
    });
  };

  // Called when the change button is clicked
  const handleChangeButtonClick = () => {
    setIsChangeMode(true);
  };

  // Called when the cancel button is clicked
  const handleCancel = () => {
    setNewUsername(authUser.username);
    setNewUsernameError("");
    setIsChangeMode(false);
  };

  // Called after the mutation is completed
  function finishChangeUsername() {
    setIsChangeMode(false);
  }

  // Called when the mutation returns an error
  function handleError(error: ApolloError) {
    setNewUsernameError(error.message);
  }

  return (
    <Box
      sx={{
        position: "relative",
        marginRight: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="body1">Username</Typography>

      {isChangeMode ? (
        <>
          <TextField
            size="small"
            id="username"
            label="Username"
            autoFocus
            value={newUsername}
            onChange={(event) => setNewUsername(event.target.value)}
            disabled={loading}
            error={Boolean(newUsernameError)}
            helperText={newUsernameError}
            sx={{ width: 300, marginTop: 1 }}
          />

          <StyledButtonBox
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
            }}
          >
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleChangeUsername}
              disabled={loading}
            >
              Save
            </Button>
          </StyledButtonBox>
        </>
      ) : (
        <>
          <Typography variant="body2">{`u/${authUser.username}`}</Typography>

          <StyledButtonBox>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleChangeButtonClick}
            >
              Change
            </Button>
          </StyledButtonBox>
        </>
      )}
    </Box>
  );
}

export default ChangeUsernameForm;
