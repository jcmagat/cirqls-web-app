import { SxProps } from "@mui/material";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import GoogleButton from "react-google-button";

interface Props {
  label?: string;
  sx?: SxProps;
}

function GoogleOAuthButton(props: Props) {
  const { label, sx } = props;

  const getGoogleOAuthURL = () => {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

    const options = {
      redirect_uri: process.env.REACT_APP_GOOGLE_OAUTH_REDIRECT_URL as string,
      client_id: process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID as string,
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
      ].join(" "),
    };

    const queryString = new URLSearchParams(options);

    return `${rootUrl}?${queryString.toString()}`;
  };

  return (
    <Box sx={{ ...sx }}>
      <Link href={getGoogleOAuthURL()}>
        <GoogleButton
          type="light"
          label={label ? label : " Continue with Google"}
        />
      </Link>
    </Box>
  );
}

export default GoogleOAuthButton;
