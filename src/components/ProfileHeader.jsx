import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import { useMutation } from "@apollo/client";
import { FOLLOW, UNFOLLOW } from "../graphql/mutations";

const useStyles = makeStyles({
  button: {
    marginRight: 8,
  },
});

function ProfileHeader(props) {
  const classes = useStyles();

  const authUser = localStorage.getItem("username");
  const isAuthUsersProfile = authUser === props.user.username;

  const memberSinceDate = new Date(props.user.created_at).toLocaleDateString(
    "en-us",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    if (props.user.followers.usernames.includes(authUser)) {
      setFollowed(true);
    } else {
      setFollowed(false);
    }
  }, [authUser, props.user]);

  // TODO: update user in cache
  const [follow] = useMutation(FOLLOW);

  // TODO: update user in cache
  const [unfollow] = useMutation(UNFOLLOW);

  const handleFollow = () => {
    follow({
      variables: {
        username: props.user.username,
      },
    });
  };

  const handleUnfollow = () => {
    unfollow({
      variables: {
        username: props.user.username,
      },
    });
  };

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
            {`member since ${memberSinceDate}`}
          </Typography>
        </Grid>

        <Grid item>
          <ButtonGroup variant="text">
            <Button>{props.user.following.count} Following</Button>
            <Button>{props.user.followers.count} Followers</Button>
            <Button>{100} Likes</Button>
          </ButtonGroup>
        </Grid>

        <Grid item>
          {isAuthUsersProfile ? (
            <Paper elevation={0}>
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
              >
                Edit Profile
              </Button>
              <Button variant="outlined">Saved Posts</Button>
            </Paper>
          ) : (
            <Paper elevation={0}>
              {followed ? (
                <Button
                  className={classes.button}
                  variant="contained"
                  color="secondary"
                  onClick={handleUnfollow}
                >
                  Unfollow
                </Button>
              ) : (
                <Button
                  className={classes.button}
                  variant="contained"
                  color="primary"
                  onClick={handleFollow}
                >
                  Follow
                </Button>
              )}
              <Button variant="outlined">Message</Button>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}

export default ProfileHeader;
