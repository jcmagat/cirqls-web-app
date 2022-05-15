import { useAuthUser } from "../context/AuthUserContext";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import NavBar from "../components/Navigation/NavBar";
import ChangeEmailForm from "../components/Settings/ChangeEmailForm";
import ChangePasswordForm from "../components/Settings/ChangePasswordForm";
import ChangeUsernameForm from "../components/Settings/ChangeUsernameForm";
import DeleteAccountForm from "../components/Settings/DeleteAccountForm";

function SettingsPage() {
  const authUser = useAuthUser();

  // TODO: remove props from NavBar after fixing NavBar typing

  return (
    <Container>
      <NavBar elevation={3} bottomOnly={false} />

      <Box sx={{ marginTop: 12 }}>
        {authUser && (
          <>
            <Typography variant="h6" sx={{ marginBottom: 1 }}>
              Account Settings
            </Typography>

            <Divider sx={{ marginBottom: 2 }} />

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <ChangeEmailForm />

              <ChangeUsernameForm />

              <ChangePasswordForm />

              <DeleteAccountForm />
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
}

export default SettingsPage;
