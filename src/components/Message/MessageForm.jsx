import React from "react";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import SendIcon from "@material-ui/icons/Send";
import { makeStyles } from "@material-ui/styles";
import { useMutation } from "@apollo/client";
import { SEND_MESSAGE } from "../../graphql/mutations";
import { useState } from "react";
import { MESSAGE_FRAGMENT } from "../../graphql/fragments";

const useStyles = makeStyles({
  paper: {
    padding: 16,
    display: "flex",
    gap: 8,
  },
});

function MessageForm({ user }) {
  const classes = useStyles();

  const [message, setMessage] = useState("");

  const [sendMessage] = useMutation(SEND_MESSAGE);

  const handleSend = (event) => {
    event.preventDefault();

    setMessage("");

    sendMessage({
      variables: {
        recipient: user,
        message: message,
      },
      update(cache, { data: { sendMessage } }) {
        cache.modify({
          fields: {
            messages(existingMessageRefs = []) {
              const newMessageRef = cache.writeFragment({
                data: sendMessage,
                fragment: MESSAGE_FRAGMENT,
              });

              return [newMessageRef, ...existingMessageRefs];
            },
          },
        });
      },
    });
  };

  return (
    <form onSubmit={handleSend}>
      <Paper className={classes.paper} elevation={0}>
        <TextField
          id="message"
          label="Message"
          value={message}
          variant="outlined"
          fullWidth
          onChange={(event) => setMessage(event.target.value)}
        />
        <IconButton color="primary" type="submit">
          <SendIcon />
        </IconButton>
      </Paper>
    </form>
  );
}

export default MessageForm;
