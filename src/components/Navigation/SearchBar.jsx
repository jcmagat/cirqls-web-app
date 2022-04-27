import React, { useState, useEffect } from "react";
import makeStyles from "@mui/styles/makeStyles";
import { useHistory } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { SEARCH } from "../../graphql/queries";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Popper from "@mui/material/Popper";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  results: {
    display: "flex",
    flexDirection: "column",
  },
});

function ResultCard({ result }) {
  const classes = useStyles();

  const [linkTo, setLinkTo] = useState("");
  const [avatarSrc, setAvatarSrc] = useState("");
  const [title, setTitle] = useState("");
  const [subheader, setSubheader] = useState("");

  useEffect(() => {
    if (result.__typename === "User") {
      setLinkTo(`/u/${result.username}`);
      setAvatarSrc(result.profile_pic_src);
      setTitle(`u/${result.username}`);
      setSubheader("User");
    } else {
      // Community
      setLinkTo(`/c/${result.name}`);
      setAvatarSrc(result.logo_src);
      setTitle(`c/${result.name}`);
      setSubheader(
        `Community ⋅ ${result.members.length} `.concat(
          result.members.length > 1 ? "members" : "member"
        )
      );
    }
  }, [result]);

  return (
    <>
      <Card elevation={0}>
        <CardActionArea component={Link} to={linkTo}>
          <CardHeader
            avatar={<Avatar src={avatarSrc} />}
            title={title}
            subheader={subheader}
          />
        </CardActionArea>
      </Card>

      <Divider />
    </>
  );
}

function SearchBar(props) {
  const classes = useStyles();
  const history = useHistory();

  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const [search] = useLazyQuery(SEARCH, { onCompleted: finishSearch });

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
    // Delay closing the popper to allow clicking results
    const timeOutId = setTimeout(() => setOpen(false), 100);
    return () => clearTimeout(timeOutId);
  };

  function finishSearch(data) {
    // Only add User or Community to results
    setResults(
      data.search.filter(
        (result) =>
          result.__typename === "User" || result.__typename === "Community"
      )
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <TextField
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
        <Paper className={classes.results} elevation={2}>
          {results.map((result, index) => (
            <ResultCard key={index} result={result} />
          ))}

          <Button onClick={handleSubmit}>More Results</Button>
        </Paper>
      </Popper>
    </>
  );
}

export default SearchBar;
