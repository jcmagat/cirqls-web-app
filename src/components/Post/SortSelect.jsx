import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

export const SORT_TYPES = {
  HOT: "hot",
  NEW: "new",
  TOP: "top",
  CONTROVERSIAL: "controversial",
};

function SortSelect(props) {
  const { sort, handleChangeSort, disabled } = props;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 1,
        marginBottom: 2,
      }}
    >
      <Typography>Sort :</Typography>

      <TextField
        select
        size="small"
        value={sort}
        onChange={(event) => handleChangeSort(event.target.value)}
        disabled={disabled}
      >
        <MenuItem value={SORT_TYPES.HOT}>Hot</MenuItem>
        <MenuItem value={SORT_TYPES.NEW}>New</MenuItem>
        <MenuItem value={SORT_TYPES.TOP}>Top</MenuItem>
        <MenuItem value={SORT_TYPES.CONTROVERSIAL}>Controversial</MenuItem>
      </TextField>
    </Box>
  );
}

export default SortSelect;
