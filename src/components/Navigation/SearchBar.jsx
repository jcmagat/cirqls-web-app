import React, { useState, useEffect } from "react";
import { makeStyles, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { SEARCH } from "../../graphql/queries";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Popper from "@material-ui/core/Popper";

const useStyles = makeStyles({
  popper: {
    position: "absolute",
    zIndex: 2,
  },
});

function SearchBar(props) {
  const classes = useStyles();
  const history = useHistory();

  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const [search] = useLazyQuery(SEARCH, { onCompleted: finishSearch });

  useEffect(() => {
    if (!term) {
      setResults([]);
      setOpen(false);
      return;
    }

    const timeOutId = setTimeout(
      () => search({ variables: { term: term } }),
      800
    );
    return () => clearTimeout(timeOutId);
  }, [term, search]);

  const handleSubmit = (event) => {
    event.preventDefault();

    history.push({
      pathname: "/search",
      search: `term=${term}`,
    });
  };

  function finishSearch(data) {
    setResults(data.search);
    console.log(data.search);

    if (data.search.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }

  return (
    <Paper elevation={0}>
      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          size="small"
          id="search"
          label="Search"
          onFocus={(event) => setAnchorEl(event.currentTarget)}
          onChange={(event) => setTerm(event.target.value)}
        />
      </form>

      <Popper open={open} anchorEl={anchorEl} placement="bottom-start">
        <Paper className={classes.popper}>
          <Typography variant="body1">{results.length}</Typography>
        </Paper>
      </Popper>
    </Paper>
  );
}

export default SearchBar;
