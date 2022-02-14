import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

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
