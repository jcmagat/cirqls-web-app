import React from "react";
import Box from "@mui/material/Box";

function TabPanel({ value, tab, children }) {
  return <>{value === tab && <Box sx={{ marginTop: 4 }}>{children}</Box>}</>;
}

export default TabPanel;
