import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import { useHistory } from "react-router-dom";
import { useCommunity } from "../context/CommunityContext";
import { useMutation } from "@apollo/client";
import { EDIT_COMMUNITY } from "../graphql/mutations";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Badge from "@material-ui/core/Badge";
import IconButton from "@material-ui/core/IconButton";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import NavBar from "../components/Navigation/NavBar";
import UploadDialog from "../components/Common/UploadDialog";
import { COMMUNITY_TYPES } from "../utils/constants";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  paper: {
    marginTop: 80,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  logoAndName: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
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
  const history = useHistory();

  const community = useCommunity();

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    if (!community) return;

    setTitle(community.title);
    setDescription(community.description);
    setType(community.type);
  }, [community]);

  const [editCommunity, { loading }] = useMutation(EDIT_COMMUNITY, {
    onCompleted: finishEditCommunity,
  });

  // Called when the save button is clicked
  const handleEditCommunity = () => {
    editCommunity({
      variables: {
        community_id: community.community_id,
        title: title !== community.title ? title : null,
        description: description !== community.description ? description : null,
        type: type !== community.type ? type : null,
        logo: logo,
      },
    });
  };

  // Called when the edit button on the logo is clicked
  const handleEditLogo = () => {
    setUploadDialogOpen(true);
  };

  // Called in UploadDialog to close the dialog
  const handleCloseUploadDialog = () => {
    setUploadDialogOpen(false);
  };

  // Called in UploadDialog to set logo
  const handleSetNewLogo = (logo) => {
    setLogo(logo);
  };

  // Called after the mutation is completed
  function finishEditCommunity() {
    setLogo(null);
    history.push(`/c/${community.name}`);
  }

  return (
    <Container>
      <NavBar />

      {community && (
        <Paper className={classes.paper} elevation={0}>
          <Paper className={classes.logoAndName} elevation={0}>
            <Badge
              overlap="circular"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              badgeContent={
                <IconButton onClick={handleEditLogo} disabled={loading}>
                  <EditOutlinedIcon />
                </IconButton>
              }
            >
              <Avatar
                className={classes.avatar}
                src={logo ? URL.createObjectURL(logo) : community.logo_src}
              />
            </Badge>

            <Typography variant="h5">{`c/${community.name}`}</Typography>
          </Paper>

          <UploadDialog
            open={uploadDialogOpen}
            onClose={handleCloseUploadDialog}
            onChange={handleSetNewLogo}
          />

          <TextField
            variant="outlined"
            id="type"
            label="Type"
            size="small"
            select
            value={type}
            onChange={(event) => setType(event.target.value)}
            disabled={loading}
          >
            <MenuItem value={COMMUNITY_TYPES.PUBLIC}>Public</MenuItem>
            <MenuItem value={COMMUNITY_TYPES.RESTRICTED}>Restricted</MenuItem>
          </TextField>

          <TextField
            className={classes.form}
            variant="outlined"
            size="small"
            id="title"
            label="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
          >
            + Invite
          </Button>

          <Paper className={classes.buttons} elevation={0}>
            <Button
              variant="outlined"
              color="secondary"
              component={Link}
              to={`/c/${community.name}`}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleEditCommunity}
              disabled={loading}
            >
              Save
            </Button>
          </Paper>

          <Paper className={classes.delete} elevation={0}>
            <Button
              variant="outlined"
              color="secondary"
              style={{ width: "max-content" }}
              disabled={loading}
            >
              Delete Community
            </Button>
          </Paper>
        </Paper>
      )}
    </Container>
  );
}

export default EditCommunityPage;
