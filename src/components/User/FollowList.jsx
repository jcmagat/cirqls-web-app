import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { useHistory } from "react-router-dom";
import { useAuthUser, useAuthUserUpdate } from "../../context/AuthUserContext";
import { useMutation } from "@apollo/client";
import { FOLLOW, UNFOLLOW, REMOVE_FOLLOWER } from "../../graphql/mutations";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  "& .MuiCardHeader-action": {
    alignSelf: "center",
    display: "flex",
    gap: 8,
  },
}));

// Button for when the card is in the auth user's profile
function ButtonForAuthUser({ profileUser, user, type }) {
  const authUser = useAuthUser();

  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    if (
      authUser &&
      authUser.following.some((followed) => followed.username === user.username)
    ) {
      setFollowed(true);
    } else {
      setFollowed(false);
    }
  }, [authUser, user]);

  const [unfollow] = useMutation(UNFOLLOW);
  const [removeFollower] = useMutation(REMOVE_FOLLOWER);

  const [follow] = useMutation(FOLLOW, {
    onCompleted: useAuthUserUpdate(),
  });

  const handleUnfollow = (event) => {
    event.stopPropagation();

    unfollow({
      variables: {
        username: user.username,
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
        username: user.username,
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
        username: user.username,
      },
    });
  };

  return (
    <>
      {type === "following" ? (
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
function ButtonForNonAuthUser({ user }) {
  const authUser = useAuthUser();
  const isAuthUsersCard = authUser && authUser.username === user.username;

  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    if (
      authUser &&
      authUser.following.some((followed) => followed.username === user.username)
    ) {
      setFollowed(true);
    } else {
      setFollowed(false);
    }
  }, [authUser, user]);

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
        username: user.username,
      },
    });
  };

  const handleUnfollow = (event) => {
    event.stopPropagation();

    unfollow({
      variables: {
        username: user.username,
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

function FollowCard({ profileUser, user, type }) {
  const history = useHistory();

  const authUser = useAuthUser();

  const isAuthUsersProfile =
    authUser && authUser.username === profileUser?.username;

  const handleCardClick = () => {
    history.push(`/u/${user.username}`);
  };

  return (
    <Card>
      <CardActionArea onClick={handleCardClick}>
        <StyledCardHeader
          avatar={<Avatar src={user.profile_pic_src} />}
          title={`u/${user.username}`}
          action={
            <>
              {isAuthUsersProfile ? (
                <ButtonForAuthUser
                  profileUser={profileUser}
                  user={user}
                  type={type}
                />
              ) : (
                <ButtonForNonAuthUser user={user} type={type} />
              )}
            </>
          }
        />
      </CardActionArea>
    </Card>
  );
}

function FollowList({ users, type }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {users.map((user) => (
        <FollowCard key={user.user_id} user={user} type={type} />
      ))}
    </Box>
  );
}

export default FollowList;
