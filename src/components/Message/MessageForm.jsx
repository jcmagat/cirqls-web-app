import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import { useMessageSender } from "../../context/MessagesContext";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";

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
          fullWidth
          onChange={(event) => setMessage(event.target.value)}
        />
        <IconButton color="primary" type="submit" size="large">
          <SendIcon />
        </IconButton>
      </Paper>
    </form>
  );
}

export default MessageForm;
