import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_COMMUNITY } from "../graphql/queries";
import { useMutation } from "@apollo/client";
import { EDIT_COMMUNITY } from "../graphql/mutations";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddIcon from "@mui/icons-material/Add";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import NavBar from "../components/Navigation/NavBar";
import UploadDialog from "../components/Common/UploadDialog";
import { COMMUNITY_TYPES } from "../utils/constants";

function EditCommunityPage(props) {
  const name = useParams().name;
  const history = useHistory();

  const [community, setCommunity] = useState();

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [logo, setLogo] = useState(null);

  const { data } = useQuery(GET_COMMUNITY, {
    variables: { name: name },
  });

  useEffect(() => {
    if (!data) return;

    setCommunity(data.community);
    setTitle(data.community.title);
    setDescription(data.community.description);
    setType(data.community.type);
  }, [data]);

  const [editCommunity, { loading }] = useMutation(EDIT_COMMUNITY, {
    onCompleted: finishEditCommunity,
  });

  // Called when the save button is clicked
  const handleEditCommunity = () => {
    // TODO: input validation

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
    setUploadDialogOpen(false);
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
        <Box
          sx={{
            marginTop: 12,
            marginBottom: 12,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box sx={{ alignSelf: "center", textAlign: "center" }}>
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
                  onClick={handleEditLogo}
                >
                  {community.logo_src ? (
                    <EditOutlinedIcon fontSize="small" />
                  ) : (
                    <AddIcon fontSize="small" />
                  )}
                </IconButton>
              }
            >
              <Avatar
                src={logo ? URL.createObjectURL(logo) : community.logo_src}
                sx={{ width: 100, height: 100 }}
              />
            </Badge>

            <Typography
              variant="h5"
              sx={{ marginTop: 2, marginBottom: 3 }}
            >{`c/${community.name}`}</Typography>
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
            id="title"
            label="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            disabled={loading}
          />

          <TextField
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
            <Box
              key={moderator.user_id}
              component={Link}
              href={`/u/${moderator.username}`}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1,
                width: "max-content",
              }}
            >
              <Avatar src={moderator.profile_pic_src} />
              <Typography>{`u/${moderator.username}`}</Typography>
            </Box>
          ))}

          <Button
            variant="contained"
            sx={{ alignSelf: "flex-start" }}
            disabled={loading}
          >
            + Invite
          </Button>

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
              href={`/c/${community.name}`}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleEditCommunity}
              disabled={loading}
            >
              Save
            </Button>
          </Box>

          <Button
            variant="outlined"
            color="secondary"
            sx={{ alignSelf: "center", marginTop: 4 }}
            disabled={loading}
          >
            Delete Community
          </Button>
        </Box>
      )}
    </Container>
  );
}

export default EditCommunityPage;
