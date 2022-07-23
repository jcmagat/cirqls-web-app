import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { CREATE_COMMUNITY } from "../graphql/mutations";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import NavBar from "../components/Navigation/NavBar";
import UploadDialog from "../components/Common/UploadDialog";
import { COMMUNITY_TYPES } from "../utils/constants";
import { Link } from "react-router-dom";

function CreateCommunityPage(props) {
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

      <Box
        sx={{
          marginTop: 12,
          marginBottom: 12,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box sx={{ alignSelf: "center", marginBottom: 4 }}>
          <Badge
            overlap="circular"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            badgeContent={
              <IconButton
                size="small"
                sx={{
                  borderRadius: "50%",
                  color: (theme) => theme.palette.primary.contrastText,
                  background: (theme) => theme.palette.primary.main,
                  boxShadow: (theme) => theme.shadows[2],
                  "&:hover": {
                    background: (theme) => theme.palette.primary.dark,
                    boxShadow: (theme) => theme.shadows[4],
                  },
                }}
                disabled={loading}
                onClick={handleEditLogo}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            }
          >
            <Avatar
              src={logo ? URL.createObjectURL(logo) : null}
              sx={{ width: 100, height: 100 }}
            />
          </Badge>
        </Box>

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
          size="small"
          id="name"
          label="Name"
          onChange={(event) => setName(event.target.value)}
          error={Boolean(nameError)}
          helperText={nameError}
          disabled={loading}
        />

        <TextField
          size="small"
          id="title"
          label="Title"
          onChange={(event) => setTitle(event.target.value)}
          disabled={loading}
        />

        <TextField
          size="small"
          id="description"
          label="Description"
          multiline
          rows={8}
          onChange={(event) => setDescription(event.target.value)}
          disabled={loading}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: 1,
          }}
        >
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
        </Box>
      </Box>
    </Container>
  );
}

export default CreateCommunityPage;
