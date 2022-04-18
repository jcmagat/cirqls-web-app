import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import { useHistory } from "react-router-dom";
import { useCommunity } from "../context/CommunityContext";
import { useMutation } from "@apollo/client";
import { CREATE_COMMUNITY } from "../graphql/mutations";
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
  const [logo, setLogo] = useState(null);

  const [createCommunity, { loading }] = useMutation(CREATE_COMMUNITY, {
    onCompleted: finishCreateCommunity,
  });

  const handleCreateCommunity = () => {
    createCommunity({
      variables: {
        name: name,
        title: title,
        description: description,
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
  function finishCreateCommunity(data) {
    history.push(`/c/${data.createCommunity.name}`);
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
              <IconButton onClick={handleEditLogo} disabled={loading}>
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
          onChange={handleSetNewLogo}
        />

        <TextField
          className={classes.form}
          variant="outlined"
          size="small"
          id="name"
          label="Name"
          onChange={(event) => setName(event.target.value)}
          disabled={loading}
        />

        <TextField
          className={classes.form}
          variant="outlined"
          size="small"
          id="title"
          label="Title"
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
