import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { useAuthUser } from "../context/AuthUserContext";
import { useQuery } from "@apollo/client";
import { GET_COMMUNITIES } from "../graphql/queries";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import NavBar from "../components/Navigation/NavBar";
import SubmitTabBar from "../components/Submit/SubmitTabBar";
import { COMMUNITY_TYPES } from "../utils/constants";

const StyledTextField = styled(TextField)(({ theme, error }) => ({
  "& .MuiSelect-select": {
    color: error ? theme.palette.error.main : "inherit",
  },
  "& .MuiSelect-icon": {
    color: error ? theme.palette.error.main : "inherit",
  },
}));

function SubmitPage(props) {
  const authUser = useAuthUser();

  const [communities, setCommunities] = useState([]);

  const { data, loading } = useQuery(GET_COMMUNITIES);

  useEffect(() => {
    if (!data || !authUser) return;

    // Only show:
    // public communities
    // restricted communities that authUser is a moderator of
    setCommunities(
      data.communities.filter(
        (community) =>
          community.type === COMMUNITY_TYPES.PUBLIC ||
          (community.type === COMMUNITY_TYPES.RESTRICTED &&
            community.moderators.some(
              (moderator) => moderator.user_id === authUser.user_id
            ))
      )
    );
  }, [data, authUser]);

  const [communityId, setCommunityId] = useState();
  const [communityIdError, setCommunityIdError] = useState("");

  const handleChangeCommunityId = (event) => {
    setCommunityId(parseInt(event.target.value));
    setCommunityIdError("");
  };

  const handleCommunityIdError = () => {
    setCommunityIdError("Please choose a community");
  };

  return (
    <Container component="main" maxWidth="md">
      <NavBar />

      <Box
        sx={{
          marginTop: 12,
          marginBottom: 12,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            marginRight: 3,
            marginBottom: 1,
          }}
        >
          <StyledTextField
            select
            id="community"
            label="Community"
            defaultValue={"default"}
            sx={{ width: 300 }}
            error={Boolean(communityIdError)}
            helperText={communityIdError}
            onChange={handleChangeCommunityId}
            disabled={loading}
          >
            <MenuItem value="default" disabled>
              Choose a community
            </MenuItem>
            {communities.map((community) => (
              <MenuItem
                key={community.community_id}
                value={community.community_id}
              >
                {community.name}
              </MenuItem>
            ))}
          </StyledTextField>

          <Button variant="outlined" color="primary" href={"/create-community"}>
            Create A Community
          </Button>
        </Box>

        <SubmitTabBar
          communityId={communityId}
          onCommunityIdError={handleCommunityIdError}
        />
      </Box>
    </Container>
  );
}

export default SubmitPage;
