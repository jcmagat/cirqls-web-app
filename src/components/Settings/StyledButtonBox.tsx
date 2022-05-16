import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

const StyledButtonBox = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  [theme.breakpoints.down("md")]: {
    position: "relative",
    marginTop: 8,
  },
}));

export default StyledButtonBox;
