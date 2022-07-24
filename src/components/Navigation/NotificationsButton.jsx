import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useNotifications } from "../../context/NotificationsContext";
import { useMutation } from "@apollo/client";
import { READ_COMMENTS } from "../../graphql/mutations";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import Popper from "@mui/material/Popper";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import { GET_NOTIFICATIONS } from "../../graphql/queries";

function NotificationCard({ notification, isLast }) {
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
      <Card elevation={0}>
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
    onCompleted: () => setOpen(false),
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
      <IconButton onClick={handleButtonClick} size="large">
        <Badge color="primary" badgeContent={notifications.length}>
          <NotificationsOutlinedIcon />
        </Badge>
      </IconButton>

      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom-end"
        disablePortal
      >
        <Paper
          elevation={2}
          sx={{ display: "flex", flexDirection: "column", maxWidth: 400 }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingLeft: 1,
            }}
          >
            <Typography variant="subtitle1">Notifications</Typography>

            <Button color="primary" onClick={handleReadAll}>
              Mark All As Read
            </Button>
          </Box>

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
