import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { SEARCH } from "../../graphql/queries";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Popper from "@mui/material/Popper";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

function ResultCard({ result }) {
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

function SearchBar({ sx }) {
  const history = useHistory();

  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);

  const [open, setOpen] = useState(false);

  const formRef = useRef(null);
  const inputRef = useRef(null);

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

  const handleFocus = () => {
    if (results.length > 0) {
      // Delay opening the popper to outset the closing delay
      // for when the search icon is clicked while already focused on input
      setTimeout(() => setOpen(true), 101);
    }
  };

  const handleUnfocus = () => {
    // Delay closing the popper to allow clicking results
    setTimeout(() => setOpen(false), 100);
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
      <form ref={formRef} style={{ ...sx }} onSubmit={handleSubmit}>
        <FormControl size="small" fullWidth>
          <OutlinedInput
            id="search"
            type="text"
            placeholder="Search"
            inputRef={inputRef}
            onFocus={handleFocus}
            onBlur={handleUnfocus}
            onChange={(event) => setTerm(event.target.value)}
            startAdornment={
              <IconButton
                edge="start"
                size="medium"
                disableRipple
                onClick={() => inputRef.current.focus()}
              >
                <SearchIcon />
              </IconButton>
            }
          />
        </FormControl>
      </form>

      <Popper
        open={open}
        anchorEl={formRef.current}
        placement="bottom-start"
        disablePortal
      >
        <Paper
          elevation={2}
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
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
