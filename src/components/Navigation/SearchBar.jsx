import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { SEARCH } from "../../graphql/queries";
import TextField from "@material-ui/core/TextField";

function SearchBar(props) {
  const history = useHistory();

  const [term, setTerm] = useState("");

  const [search] = useLazyQuery(SEARCH, { onCompleted: finishSearch });

  const handleSearch = (event) => {
    event.preventDefault();

    console.log(term);

    search({
      variables: {
        term: term,
      },
    });
  };

  function finishSearch(data) {
    console.log(data.search);

    history.push({
      pathname: "/search",
      search: `term=${term}`,
    });
  }

  return (
    <form onSubmit={handleSearch}>
      <TextField
        variant="outlined"
        size="small"
        id="search"
        label="Search"
        onChange={(event) => setTerm(event.target.value)}
      />
    </form>
  );
}

export default SearchBar;
