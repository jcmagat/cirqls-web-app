import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { useMessageSender } from "../../context/MessagesContext";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import SendIcon from "@material-ui/icons/Send";

const useStyles = makeStyles({
  paper: {
    padding: 16,
    display: "flex",
    gap: 8,
  },
});

function MessageForm(props) {
  const classes = useStyles();

  const sendMessage = useMessageSender();

  const [message, setMessage] = useState("");

  const handleSendMessage = (event) => {
    event.preventDefault();

    sendMessage(message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSendMessage}>
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
