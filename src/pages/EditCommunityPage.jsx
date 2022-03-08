import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import { useCommunity } from "../context/CommunityContext";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Badge from "@material-ui/core/Badge";
import IconButton from "@material-ui/core/IconButton";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import NavBar from "../components/Navigation/NavBar";
import UploadDialog from "../components/Common/UploadDialog";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  paper: {
    marginTop: 80,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  paperCentered: {
    display: "flex",
    justifyContent: "center",
  },
  avatar: {
    width: 80,
    height: 80,
  },
  moderator: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    width: "max-content",
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  delete: {
    display: "flex",
    justifyContent: "center",
    marginTop: 32,
  },
});

function EditCommunityPage(props) {
  const classes = useStyles();

  const community = useCommunity();

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [newLogo, setNewLogo] = useState("");

  useEffect(() => {
    if (!community) return;

    setTitle(community.title);
    setDescription(community.description);
  }, [community]);

  const handleEditLogo = () => {
    setUploadDialogOpen(true);
  };

  const handleCloseUploadDialog = () => {
    setUploadDialogOpen(false);
  };

  const handleChangeLogo = (logo) => {
    setNewLogo(logo);
  };

  return (
    <Container>
      <NavBar />

      {community && (
        <Paper className={classes.paper} elevation={0}>
          <Paper className={classes.paperCentered} elevation={0}>
            <Badge
              overlap="circular"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              badgeContent={
                <IconButton
                  onClick={handleEditLogo}
                  // disabled={changeProfilePicLoading}
                >
                  <EditOutlinedIcon />
                </IconButton>
              }
            >
              <Avatar
                className={classes.avatar}
                src={
                  newLogo ? URL.createObjectURL(newLogo) : community.logo_src
                }
              />
            </Badge>
          </Paper>

          <UploadDialog
            open={uploadDialogOpen}
            onClose={handleCloseUploadDialog}
            onChange={handleChangeLogo}
          />

          <Paper className={classes.paperCentered} elevation={0}>
            <Typography variant="h5">{`c/${community.name}`}</Typography>
          </Paper>

          <TextField
            className={classes.form}
            variant="outlined"
            size="small"
            id="title"
            label="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            // disabled={loading}
            // error={Boolean(newUsernameError)}
            // helperText={newUsernameError}
          />

          <TextField
            className={classes.form}
            variant="outlined"
            size="small"
            id="description"
            label="Description"
            multiline
            rows={8}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            // disabled={loading}
            // error={Boolean(newUsernameError)}
            // helperText={newUsernameError}
          />

          <Typography>Moderators:</Typography>

          {community.moderators.map((moderator) => (
            <Paper
              className={classes.moderator}
              elevation={0}
              key={moderator.user_id}
              component={Link}
              to={`/u/${moderator.username}`}
            >
              <Avatar src={moderator.profile_pic_src} />
              <Typography>{`u/${moderator.username}`}</Typography>
            </Paper>
          ))}

          <Button
            variant="contained"
            color="primary"
            style={{ width: "max-content" }}
          >
            + Invite
          </Button>

          <Paper className={classes.buttons} elevation={0}>
            <Button
              variant="outlined"
              color="secondary"
              component={Link}
              to={`/c/${community.name}`}
            >
              Cancel
            </Button>

            <Button variant="contained" color="primary">
              Save
            </Button>
          </Paper>

          <Paper className={classes.delete} elevation={0}>
            <Button
              variant="outlined"
              color="secondary"
              style={{ width: "max-content" }}
            >
              Delete Circle
            </Button>
          </Paper>
        </Paper>
      )}
    </Container>
  );
}

export default EditCommunityPage;
