import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { FOLLOW, UNFOLLOW, REMOVE_FOLLOWER } from "../graphql/mutations";
import { useAuthUser } from "../context/AuthUserContext";

const useStyles = makeStyles({
  card: {
    display: "flex",
    justifyContent: "space-between",
  },
  paper: {
    display: "flex",
    alignItems: "center",
  },
  button: {
    height: 32,
    marginRight: 16,
  },
});

// Button for when the card is in the auth user's profile
function ButtonForAuthUser(props) {
  const classes = useStyles();

  const [unfollow] = useMutation(UNFOLLOW);
  const [removeFollower] = useMutation(REMOVE_FOLLOWER);

  const handleUnfollow = () => {
    unfollow({
      variables: {
        username: props.user.username,
      },
      // update(cache, result) {
      //   console.log(cache);
      // },
    });
  };

  const handleRemoveFollower = () => {
    removeFollower({
      variables: {
        username: props.user.username,
      },
      // update(cache, result) {
      //   cache.modify({
      //     id: 'User:{"username":"jcmagat"}',
      //     fields: {
      //       followers(existingFollowerRefs = [], { readField }) {
      //         return existingFollowerRefs.filter(
      //           (followerRef) =>
      //             readField("username", followerRef) !== props.user.username
      //         );
      //       },
      //     },
      //   });
      // },
    });
  };

  return (
    <Paper elevation={0}>
      {props.type === "following" ? (
        <Button
          className={classes.button}
          variant="outlined"
          color="secondary"
          onClick={handleUnfollow}
        >
          Unfollow
        </Button>
      ) : (
        <Button
          className={classes.button}
          variant="outlined"
          color="secondary"
          onClick={handleRemoveFollower}
        >
          Remove
        </Button>
      )}
    </Paper>
  );
}

// Button for when the card is not in the auth user's profile
function ButtonForNotAuthUser(props) {
  const classes = useStyles();

  const authUser = useAuthUser();
  const isAuthUsersCard = authUser && authUser.username === props.user.username;

  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    if (
      authUser &&
      authUser.following.some(
        (followed) => followed.username === props.user.username
      )
    ) {
      setFollowed(true);
    }
  });

  const [follow] = useMutation(FOLLOW);
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
      {isAuthUsersCard ? (
        <></>
      ) : (
        <Paper elevation={0}>
          {followed ? (
            <Button
              className={classes.button}
              variant="outlined"
              color="primary"
              onClick={handleUnfollow}
            >
              Following
            </Button>
          ) : (
            <Button
              className={classes.button}
              variant="outlined"
              color="primary"
              onClick={handleFollow}
            >
              Follow
            </Button>
          )}
        </Paper>
      )}
    </Paper>
  );
}

function FollowCard(props) {
  const classes = useStyles();

  const followSinceDate = new Date(props.user.followed_at).toLocaleDateString(
    "en-us",
    {
      month: "long",
      year: "numeric",
    }
  );

  return (
    <Card className={classes.card}>
      <CardActionArea component={Link} to={`/profile/${props.user.username}`}>
        <CardHeader
          avatar={
            <Avatar>{props.user.username.charAt(0).toUpperCase()}</Avatar>
          }
          title={props.user.username}
          subheader={`${props.type} since ${followSinceDate}`}
        />
      </CardActionArea>

      <Paper className={classes.paper} elevation={0}>
        {props.isAuthUsersProfile ? (
          <ButtonForAuthUser user={props.user} type={props.type} />
        ) : (
          <ButtonForNotAuthUser user={props.user} type={props.type} />
        )}
      </Paper>
    </Card>
  );
}

export default FollowCard;
