import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { SEARCH } from "../../graphql/queries";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Popper from "@material-ui/core/Popper";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  popper: {
    padding: 8,
  },
});

function SearchBar(props) {
  const classes = useStyles();
  const history = useHistory();

  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const [search] = useLazyQuery(SEARCH, {
    onCompleted: (data) => setResults(data.search),
  });

  useEffect(() => {
    const timeOutId = setTimeout(
      () => search({ variables: { term: term } }),
      800
    );
    return () => clearTimeout(timeOutId);
  }, [term, search]);

  useEffect(() => {
    if (results.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [results]);

  const handleSubmit = (event) => {
    event.preventDefault();

    history.push({
      pathname: "/search",
      search: `term=${term}`,
    });
  };

  const handleFocus = (event) => {
    setAnchorEl(event.currentTarget);

    if (results.length > 0) {
      setOpen(true);
    }
  };

  const handleUnfocus = () => {
    setOpen(false);
  };

  return (
    <Paper elevation={0}>
      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          size="small"
          id="search"
          label="Search"
          onFocus={handleFocus}
          onBlur={handleUnfocus}
          onChange={(event) => setTerm(event.target.value)}
        />
      </form>

      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom-start"
        disablePortal
      >
        <Paper className={classes.popper}>
          <Typography variant="body1">{results.length}</Typography>
        </Paper>
      </Popper>
    </Paper>
  );
}

export default SearchBar;
