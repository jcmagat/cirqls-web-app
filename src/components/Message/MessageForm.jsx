import React from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import SendIcon from "@material-ui/icons/Send";
import { makeStyles } from "@material-ui/styles";
import { useMutation } from "@apollo/client";
import { SEND_MESSAGE } from "../../graphql/mutations";
import { useState } from "react";

const useStyles = makeStyles({
  paper: {
    padding: 16,
  },
});

function MessageForm({ user }) {
  const classes = useStyles();

  const [message, setMessage] = useState("");

  const [sendMessage] = useMutation(SEND_MESSAGE);

  const handleSend = () => {
    sendMessage({
      variables: {
        recipient: user,
        message: message,
      },
    });
  };

  return (
    <Paper className={classes.paper} elevation={0}>
      <Grid container>
        <Grid item xs={11}>
          <TextField
            id="message"
            label="Message"
            variant="outlined"
            fullWidth
            onChange={(event) => setMessage(event.target.value)}
          />
        </Grid>

        <Grid item xs={1}>
          <IconButton color="primary" onClick={handleSend}>
            <SendIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default MessageForm;
