import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import { useHistory } from "react-router-dom";
import { useAuthUser, useAuthUserUpdate } from "../../context/AuthUserContext";
import { useMutation } from "@apollo/client";
import { FOLLOW, UNFOLLOW } from "../../graphql/mutations";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
  action: {
    marginTop: "auto",
    marginBottom: "auto",
  },
});

function UserCard({ user }) {
  const classes = useStyles();
  const history = useHistory();

  const authUser = useAuthUser();

  const [isAuthUsersCard, setIsAuthUsersCard] = useState(false);
  const [isAuthUserFollowing, setIsAuthUserFollowing] = useState(false);

  useEffect(() => {
    // Check if the user is the auth user
    if (authUser && authUser.user_id === user.user_id) {
      setIsAuthUsersCard(true);
      return;
    } else {
      setIsAuthUsersCard(false);
    }

    // Check if the user is followed by the auth user
    if (
      authUser &&
      authUser.following.some((followed) => followed.username === user.username)
    ) {
      setIsAuthUserFollowing(true);
    } else {
      setIsAuthUserFollowing(false);
    }
  }, [authUser, user]);

  const [follow] = useMutation(FOLLOW, {
    onCompleted: useAuthUserUpdate(),
  });

  const [unfollow] = useMutation(UNFOLLOW, {
    onCompleted: useAuthUserUpdate(),
  });

  const handleActionButtonClick = (event) => {
    event.stopPropagation();

    if (isAuthUserFollowing) {
      unfollow({
        variables: {
          username: user.username,
        },
      });
    } else {
      follow({
        variables: {
          username: user.username,
        },
      });
    }
  };

  const handleCardClick = () => {
    history.push(`/u/${user.username}`);
  };

  return (
    <Card>
      <CardActionArea onClick={handleCardClick}>
        <CardHeader
          avatar={<Avatar src={user.profile_pic_src} />}
          title={`u/${user.username}`}
          subheader={"100 likes"}
          action={
            <>
              {!isAuthUsersCard && (
                <>
                  {isAuthUserFollowing ? (
                    <Button
                      variant="outlined"
                      color="primary"
                      component="div"
                      onMouseDown={(event) => event.stopPropagation()}
                      onClick={handleActionButtonClick}
                    >
                      Following
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      component="div"
                      onMouseDown={(event) => event.stopPropagation()}
                      onClick={handleActionButtonClick}
                    >
                      Follow
                    </Button>
                  )}
                </>
              )}
            </>
          }
          classes={{ action: classes.action }}
        />
      </CardActionArea>
    </Card>
  );
}

export default UserCard;
