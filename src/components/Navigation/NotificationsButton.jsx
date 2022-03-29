import React, { useState } from "react";
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
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  card: {
    boxShadow: "none",
  },
});

function NotificationCard({ notification, isLast }) {
  const classes = useStyles();

  return (
    <>
      <Card className={classes.card}>
        <CardActionArea component={Link} to={"/"}>
          <CardHeader
            avatar={<Avatar>GG</Avatar>}
            title={"title"}
            subheader={"subheader"}
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
