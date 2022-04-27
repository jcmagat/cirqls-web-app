import React from "react";
import makeStyles from "@mui/styles/makeStyles";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

const useStyles = makeStyles({
  sort: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
});

export const SORT_TYPES = {
  HOT: "hot",
  NEW: "new",
  TOP: "top",
  CONTROVERSIAL: "controversial",
};

function SortSelect({ sort, handleChangeSort }) {
  const classes = useStyles();

  return (
    <Paper className={classes.sort} elevation={0}>
      <Typography>Sort :</Typography>
      <TextField
        select
        size="small"
        value={sort}
        onChange={(event) => handleChangeSort(event.target.value)}
      >
        <MenuItem value={SORT_TYPES.HOT}>Hot</MenuItem>
        <MenuItem value={SORT_TYPES.NEW}>New</MenuItem>
        <MenuItem value={SORT_TYPES.TOP}>Top</MenuItem>
        <MenuItem value={SORT_TYPES.CONTROVERSIAL}>Controversial</MenuItem>
      </TextField>
    </Paper>
  );
}

export default SortSelect;
