import React from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import SendIcon from "@material-ui/icons/Send";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  paper: {
    padding: 16,
  },
});

function MessageForm(props) {
  const classes = useStyles();

  return (
    <Paper className={classes.paper} elevation={0}>
      <Grid container>
        <Grid item xs={11}>
          <TextField
            id="message"
            label="Message"
            variant="outlined"
            fullWidth
          />
        </Grid>

        <Grid item xs={1}>
          <IconButton color="primary">
            <SendIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default MessageForm;
