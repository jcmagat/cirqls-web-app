import React from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import TollIcon from "@mui/icons-material/Toll";
import Typography from "@mui/material/Typography";

function Logo(props) {
  return (
    <Box
      component={Link}
      href="/"
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 1,
      }}
    >
      <TollIcon fontSize="large" />
      <Typography variant="h5">Cirqls</Typography>
    </Box>
  );
}

export default Logo;
