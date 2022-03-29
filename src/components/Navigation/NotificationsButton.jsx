import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { useNotifications } from "../../context/NotificationsContext";
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

const useStyles = makeStyles({
  card: {
    boxShadow: "none",
  },
});

function NotificationCard({ notification, isLast }) {
  const classes = useStyles();

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

  return (
    <>
      <Card className={classes.card}>
        <CardActionArea>
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
  const notifications = useNotifications();

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const buttonClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => !prev);
  };

  return (
    <>
      <IconButton onClick={buttonClick}>
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
        <Paper>
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
