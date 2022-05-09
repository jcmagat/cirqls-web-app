import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { useHistory } from "react-router-dom";
import { useAuthUser, useAuthUserUpdate } from "../../context/AuthUserContext";
import { useProfileUser } from "../../context/ProfileUserContext";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useMutation } from "@apollo/client";
import { FOLLOW, UNFOLLOW, REMOVE_FOLLOWER } from "../../graphql/mutations";

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  "& .MuiCardHeader-action": {
    alignSelf: "center",
    display: "flex",
    gap: 8,
  },
}));

// Button for when the card is in the auth user's profile
function ButtonForAuthUser(props) {
  const authUser = useAuthUser();
  const profileUser = useProfileUser();

  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    if (
      authUser &&
      authUser.following.some(
        (followed) => followed.username === props.user.username
      )
    ) {
      setFollowed(true);
    } else {
      setFollowed(false);
    }
  }, [authUser, props.user]);

  const [unfollow] = useMutation(UNFOLLOW);
  const [removeFollower] = useMutation(REMOVE_FOLLOWER);

  const [follow] = useMutation(FOLLOW, {
    onCompleted: useAuthUserUpdate(),
  });

  const handleUnfollow = (event) => {
    event.stopPropagation();

    unfollow({
      variables: {
        username: props.user.username,
      },
      update(cache, { data: { unfollow } }) {
        cache.modify({
          id: cache.identify(profileUser),
          fields: {
            following(existingFollowingRefs = [], { readField }) {
              return existingFollowingRefs.filter(
                (followingRef) =>
                  readField("username", followingRef) !== unfollow.username
              );
            },
          },
        });
      },
    });
  };

  const handleRemoveFollower = (event) => {
    event.stopPropagation();

    removeFollower({
      variables: {
        username: props.user.username,
      },
      update(cache, { data: { removeFollower } }) {
        cache.modify({
          id: cache.identify(profileUser),
          fields: {
            followers(existingFollowerRefs = [], { readField }) {
              return existingFollowerRefs.filter(
                (followerRef) =>
                  readField("username", followerRef) !== removeFollower.username
              );
            },
          },
        });
      },
    });
  };

  const handleFollow = (event) => {
    event.stopPropagation();

    follow({
      variables: {
        username: props.user.username,
      },
    });
  };

  return (
    <>
      {props.type === "following" ? (
        <Button
          variant="outlined"
          color="secondary"
          component="div"
          onMouseDown={(event) => event.stopPropagation()}
          onClick={handleUnfollow}
        >
          Unfollow
        </Button>
      ) : (
        <>
          <Button
            variant="outlined"
            color="secondary"
            component="div"
            onMouseDown={(event) => event.stopPropagation()}
            onClick={handleRemoveFollower}
          >
            Remove
          </Button>

          {followed ? (
            <Button
              variant="outlined"
              color="primary"
              component="div"
              onMouseDown={(event) => event.stopPropagation()}
              onClick={handleUnfollow}
            >
              Following
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="primary"
              component="div"
              onMouseDown={(event) => event.stopPropagation()}
              onClick={handleFollow}
            >
              Follow Back
            </Button>
          )}
        </>
      )}
    </>
  );
}

// Button for when the card is not in the auth user's profile
function ButtonForNotAuthUser(props) {
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
    } else {
      setFollowed(false);
    }
  }, [authUser, props.user]);

  const [follow] = useMutation(FOLLOW, {
    onCompleted: useAuthUserUpdate(),
  });

  const [unfollow] = useMutation(UNFOLLOW, {
    onCompleted: useAuthUserUpdate(),
  });

  const handleFollow = (event) => {
    event.stopPropagation();

    follow({
      variables: {
        username: props.user.username,
      },
    });
  };

  const handleUnfollow = (event) => {
    event.stopPropagation();

    unfollow({
      variables: {
        username: props.user.username,
      },
    });
  };

  return (
    <>
      {isAuthUsersCard ? (
        <></>
      ) : (
        <>
          {followed ? (
            <Button
              variant="outlined"
              color="primary"
              component="div"
              onMouseDown={(event) => event.stopPropagation()}
              onClick={handleUnfollow}
            >
              Following
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="primary"
              component="div"
              onMouseDown={(event) => event.stopPropagation()}
              onClick={handleFollow}
            >
              Follow
            </Button>
          )}
        </>
      )}
    </>
  );
}

function FollowCard(props) {
  const history = useHistory();

  const authUser = useAuthUser();
  const profileUser = useProfileUser();

  const isAuthUsersProfile =
    authUser && authUser.username === profileUser.username;

  const followSinceDate = new Date(props.user.followed_at).toLocaleDateString(
    "en-us",
    {
      month: "long",
      year: "numeric",
    }
  );

  const handleCardClick = () => {
    history.push(`/u/${props.user.username}`);
  };

  return (
    <Card>
      <CardActionArea onClick={handleCardClick}>
        <StyledCardHeader
          avatar={
            <Avatar>{props.user.username.charAt(0).toUpperCase()}</Avatar>
          }
          title={`u/${props.user.username}`}
          subheader={`${props.type} since ${followSinceDate}`}
          subheaderTypographyProps={{ noWrap: true }}
          action={
            <>
              {isAuthUsersProfile ? (
                <ButtonForAuthUser user={props.user} type={props.type} />
              ) : (
                <ButtonForNotAuthUser user={props.user} type={props.type} />
              )}
            </>
          }
        />
      </CardActionArea>
    </Card>
  );
}

export default FollowCard;
