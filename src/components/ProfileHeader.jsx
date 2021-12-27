import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";

const useStyles = makeStyles({
  button: {
    marginRight: 8,
  },
});

function ProfileHeader(props) {
  const classes = useStyles();

  const created_at_date = new Date(props.user.created_at).toLocaleDateString(
    "en-us",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <Paper elevation={0}>
      <Grid container spacing={2} direction="column" alignItems="center">
        <Grid item>
          <AccountCircleOutlinedIcon fontSize="large" />
        </Grid>

        <Grid item>
          <Typography variant="h6">{`@${props.user.username}`}</Typography>
        </Grid>

        <Grid item>
          <Typography variant="body2">
            {`member since ${created_at_date}`}
          </Typography>
        </Grid>

        <Grid item>
          <ButtonGroup variant="text">
            <Button>{props.user.following.count} following</Button>
            <Button>{props.user.followers.count} followers</Button>
            <Button>{100} likes</Button>
          </ButtonGroup>
        </Grid>

        <Grid item>
          <Paper elevation={0}>
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
            >
              follow
            </Button>
            <Button variant="outlined">message</Button>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default ProfileHeader;
