import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { useQuery } from "@apollo/client";
import { GET_MESSAGES } from "../graphql/queries";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import NavBar from "../components/NavBar";
import MessageArea from "../components/Message/MessageArea";
import { useParams } from "react-router-dom";

const useStyles = makeStyles({
  paper: {
    marginTop: 80,
  },
});

function MessagesPage(props) {
  const classes = useStyles();

  const { username } = useParams();

  const [messages, setMessages] = useState([]);

  const { data } = useQuery(GET_MESSAGES, {
    variables: {
      username: username,
    },
  });

  useEffect(() => {
    if (data) {
      setMessages(data.messages);
    }
  }, [data]);

  return (
    <Container>
      <Paper elevation={0}>
        <NavBar />

        <Paper className={classes.paper}>
          <MessageArea messages={messages} user={username} />
        </Paper>
      </Paper>
    </Container>
  );
}

export default MessagesPage;
