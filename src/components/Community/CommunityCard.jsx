import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { useHistory } from "react-router-dom";
import { useAuthUser } from "../../context/AuthUserContext";
import { useMutation } from "@apollo/client";
import { JOIN, LEAVE } from "../../graphql/mutations";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

const useStyles = makeStyles({
  action: {
    marginTop: "auto",
    marginBottom: "auto",
  },
});

function CommunityCard({ community }) {
  const classes = useStyles();
  const history = useHistory();

  const authUser = useAuthUser();

  const [isAuthUserMember, setIsAuthUserMember] = useState(false);

  useEffect(() => {
    if (
      authUser &&
      community.members.some((member) => member.user_id === authUser.user_id)
    ) {
      setIsAuthUserMember(true);
    } else {
      setIsAuthUserMember(false);
    }
  }, [authUser, community]);

  const [join] = useMutation(JOIN);
  const [leave] = useMutation(LEAVE);

  const handleActionButtonClick = (event) => {
    event.stopPropagation();

    if (isAuthUserMember) {
      leave({
        variables: {
          community_id: community.community_id,
        },
      });
    } else {
      join({
        variables: {
          community_id: community.community_id,
        },
      });
    }
  };

  const handleCardClick = () => {
    history.push(`/c/${community.name}`);
  };

  return (
    <Card>
      <CardActionArea onClick={handleCardClick}>
        <CardHeader
          avatar={<Avatar src={community.logo_src} />}
          title={`c/${community.name}`}
          subheader={`${community.members.length} `.concat(
            community.members.length > 1 ? "members" : "member"
          )}
          action={
            <Paper elevation={0}>
              {isAuthUserMember ? (
                <Button
                  variant="outlined"
                  color="primary"
                  component="div"
                  onMouseDown={(event) => event.stopPropagation()}
                  onClick={handleActionButtonClick}
                >
                  Joined
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  component="div"
                  onMouseDown={(event) => event.stopPropagation()}
                  onClick={handleActionButtonClick}
                >
                  Join
                </Button>
              )}
            </Paper>
          }
          classes={{ action: classes.action }}
        />
      </CardActionArea>
    </Card>
  );
}

export default CommunityCard;
