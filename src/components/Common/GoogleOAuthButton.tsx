import { Button, SxProps } from "@mui/material";

interface Props {
  label?: string;
  sx?: SxProps;
}

function GoogleOAuthButton(props: Props) {
  const { label, sx } = props;

  // Request an access token
  function getAuthCode() {
    // Request authorization code and obtain user consent
    (window as any).client.requestCode();
  }

  return (
    <Button variant="outlined" onClick={getAuthCode}>
      Sign In with Google
    </Button>
  );
}

export default GoogleOAuthButton;
