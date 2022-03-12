import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { SEARCH } from "../../graphql/queries";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Popper from "@material-ui/core/Popper";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  results: {
    display: "flex",
    flexDirection: "column",
  },
  card: {
    boxShadow: "none",
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
        `Circle ⋅ ${result.members.length} `.concat(
          result.members.length > 1 ? "members" : "member"
        )
      );
    }
  }, [result]);

  return (
    <Paper elevation={0}>
      <Card className={classes.card}>
        <CardActionArea component={Link} to={linkTo}>
          <CardHeader
            avatar={<Avatar src={avatarSrc} />}
            title={title}
            subheader={subheader}
          />
        </CardActionArea>
      </Card>

      <Divider />
    </Paper>
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
        <Paper className={classes.results}>
          {results.map((result, index) => (
            <ResultCard key={index} result={result} />
          ))}

          <Button onClick={handleSubmit}>More Results</Button>
        </Paper>
      </Popper>
    </Paper>
  );
}

export default SearchBar;
