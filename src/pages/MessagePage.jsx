import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { useQuery, useSubscription } from "@apollo/client";
import { GET_MESSAGES } from "../graphql/queries";
import { NEW_MESSAGE } from "../graphql/subscriptions";
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

  const { data: getMessagesData } = useQuery(GET_MESSAGES, {
    variables: {
      username: username,
    },
  });

  useEffect(() => {
    if (getMessagesData) {
      setMessages(getMessagesData.messages);
    }
  }, [getMessagesData]);

  const { data: newMessageData } = useSubscription(NEW_MESSAGE);

  useEffect(() => {
    if (newMessageData) {
      setMessages((prevMessages) => [
        newMessageData.newMessage,
        ...prevMessages,
      ]);
    }
  }, [newMessageData]);

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
