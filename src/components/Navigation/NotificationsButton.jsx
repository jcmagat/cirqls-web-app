import React, { useState, useEffect } from "react";
import { Button, makeStyles, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useNotifications } from "../../context/NotificationsContext";
import { useMutation } from "@apollo/client";
import { READ_COMMENTS } from "../../graphql/mutations";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import NotificationsOutlinedIcon from "@material-ui/icons/NotificationsOutlined";
import Popper from "@material-ui/core/Popper";
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import { GET_NOTIFICATIONS } from "../../graphql/queries";

const useStyles = makeStyles({
  popper: {
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 8,
  },
  card: {
    boxShadow: "none",
  },
});

function NotificationCard({ notification, isLast }) {
  const classes = useStyles();
  const history = useHistory();

  const [avatarSrc, setAvatarSrc] = useState("");
  const [title, setTitle] = useState("");
  const [subheader, setSubheader] = useState("");

  useEffect(() => {
    if (notification.__typename === "Comment") {
      setAvatarSrc(notification.commenter.profile_pic_src);
      setTitle(
        `u/${notification.commenter.username} replied to your `.concat(
          notification.parent_comment_id ? "comment" : "post"
        )
      );
      setSubheader(notification.message);
    }
  }, [notification]);

  const [readComments] = useMutation(READ_COMMENTS, {
    onCompleted: finishReadComments,
  });

  const handleCardClick = () => {
    if (notification.__typename === "Comment") {
      readComments({
        variables: {
          comment_ids: [notification.comment_id],
        },
      });
    }
  };

  function finishReadComments(data) {
    history.push({
      pathname: `/post/${notification.post_id}`,
      search: `comment=${notification.comment_id}`,
    });
  }

  return (
    <>
      <Card className={classes.card}>
        <CardActionArea onClick={handleCardClick}>
          <CardHeader
            avatar={<Avatar src={avatarSrc} />}
            title={title}
            subheader={subheader}
          />
        </CardActionArea>
      </Card>

      {!isLast && <Divider />}
    </>
  );
}

function NotificationsButton(props) {
  const classes = useStyles();

  const notifications = useNotifications();

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleButtonClick = (event) => {
    if (!Array.isArray(notifications) || notifications.length < 1) return;

    setAnchorEl(event.currentTarget);
    setOpen((prev) => !prev);
  };

  const [readComments] = useMutation(READ_COMMENTS, {
    refetchQueries: [GET_NOTIFICATIONS],
    onCompleted: () => setOpen(false)
  });

  const handleReadAll = () => {
    const commentIds = notifications
      .filter((notification) => notification.__typename === "Comment")
      .map((notification) => notification.comment_id);

    readComments({
      variables: {
        comment_ids: commentIds,
      },
    });
  };

  return (
    <>
      <IconButton onClick={handleButtonClick}>
        <Badge color="secondary" badgeContent={notifications.length}>
          <NotificationsOutlinedIcon />
        </Badge>
      </IconButton>

      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom-end"
        disablePortal
      >
        <Paper className={classes.popper}>
          <Paper className={classes.header} elevation={0}>
            <Typography variant="subtitle1">Notifications</Typography>

            <Button color="primary" onClick={handleReadAll}>
              Mark All As Read
            </Button>
          </Paper>

          {notifications.map((notification, index) => (
            <NotificationCard
              key={index}
              notification={notification}
              isLast={index === notifications.length - 1}
            />
          ))}
        </Paper>
      </Popper>
    </>
  );
}

export default NotificationsButton;
