import { styled } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  gap: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

export default StyledMenuItem;
