import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { CREATE_COMMUNITY } from "../graphql/mutations";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
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

function CreateCommunityPage(props) {
  const classes = useStyles();
  const history = useHistory();

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState(COMMUNITY_TYPES.PUBLIC);
  const [logo, setLogo] = useState(null);

  const [nameError, setNameError] = useState("");

  useEffect(() => {
    setNameError("");
  }, [name]);

  const [createCommunity, { loading }] = useMutation(CREATE_COMMUNITY, {
    onCompleted: finishCreateCommunity,
    onError: handleError,
  });

  const handleCreateCommunity = () => {
    if (!name) {
      setNameError("Community name is required");
      return;
    }

    createCommunity({
      variables: {
        name: name,
        title: title,
        description: description,
        type: type,
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
    setUploadDialogOpen(false);
  };

  // Called after the mutation is completed
  function finishCreateCommunity(data) {
    history.push(`/c/${data.createCommunity.name}`);
  }

  // Called when the mutation returns an error
  function handleError(error) {
    if (error.message.includes("name")) {
      setNameError(error.message);
    }
  }

  return (
    <Container>
      <NavBar />

      <Paper className={classes.paper} elevation={0}>
        <Paper className={classes.logoAndName} elevation={0}>
          <Badge
            overlap="circular"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            badgeContent={
              <IconButton
                onClick={handleEditLogo}
                disabled={loading}
                size="large"
              >
                <EditOutlinedIcon />
              </IconButton>
            }
          >
            <Avatar
              className={classes.avatar}
              src={logo ? URL.createObjectURL(logo) : null}
            />
          </Badge>
        </Paper>

        <UploadDialog
          open={uploadDialogOpen}
          onClose={handleCloseUploadDialog}
          onDone={handleSetNewLogo}
        />

        <TextField
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
          size="small"
          id="name"
          label="Name"
          onChange={(event) => setName(event.target.value)}
          error={Boolean(nameError)}
          helperText={nameError}
          disabled={loading}
        />

        <TextField
          className={classes.form}
          size="small"
          id="title"
          label="Title"
          onChange={(event) => setTitle(event.target.value)}
          disabled={loading}
        />

        <TextField
          className={classes.form}
          size="small"
          id="description"
          label="Description"
          multiline
          rows={8}
          onChange={(event) => setDescription(event.target.value)}
          disabled={loading}
        />

        <Paper className={classes.buttons} elevation={0}>
          <Button
            variant="outlined"
            color="secondary"
            component={Link}
            to={"/"}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateCommunity}
            disabled={loading}
          >
            Create Community
          </Button>
        </Paper>
      </Paper>
    </Container>
  );
}

export default CreateCommunityPage;
