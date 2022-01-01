import React from "react";
import { makeStyles } from "@material-ui/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { FOLLOW } from "../graphql/mutations";

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

function FollowCard(props) {
  const classes = useStyles();

  const followSinceDate = new Date(props.user.followed_at).toLocaleDateString(
    "en-us",
    {
      month: "long",
      year: "numeric",
    }
  );

  const [follow] = useMutation(FOLLOW);

  const handleFollow = () => {
    follow({
      variables: {
        username: props.user.username,
      },
    });
  };

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
          <Button
            className={classes.button}
            variant="outlined"
            color="secondary"
          >
            Remove
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
    </Card>
  );
}

export default FollowCard;
