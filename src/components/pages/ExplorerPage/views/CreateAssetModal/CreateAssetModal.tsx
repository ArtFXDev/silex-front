import { gql, useApolloClient, useQuery } from "@apollo/client";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import QueryWrapper from "components/utils/QueryWrapper/QueryWrapper";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useRouteMatch } from "react-router-dom";
import * as Zou from "utils/zou";

const ASSET_TYPES = gql`
  query getAssetTypesForProject($id: ID!) {
    project(id: $id) {
      asset_types {
        id
        name
      }
    }
  }
`;

interface CreateAssetModalProps {
  defaultValue: string;
  onClose: () => void;
}

const CreateAssetModal = ({
  defaultValue,
  onClose,
}: CreateAssetModalProps): JSX.Element => {
  const [assetTypeId, setAssetTypeId] = useState<string>(defaultValue);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [inputError, setInputError] = useState<boolean>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const routeMatch = useRouteMatch<{ projectId: string }>();
  const client = useApolloClient();
  const { enqueueSnackbar } = useSnackbar();

  const query = useQuery<{
    // eslint-disable-next-line camelcase
    project: { asset_types: { id: string; name: string }[] };
  }>(ASSET_TYPES, {
    variables: { id: routeMatch.params.projectId },
  });
  const { data } = query;

  const handleClick = () => {
    Zou.createAsset(routeMatch.params.projectId, assetTypeId, {
      data: {},
      description,
      // eslint-disable-next-line camelcase
      episode_id: null,
      name,
    })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .then((_response) => {
        enqueueSnackbar(`Created asset: ${name}`, {
          variant: "success",
        });

        // Refresh GraphQL cache to refetch assets
        client.refetchQueries({ include: ["GetAssets"] });

        // Close the window
        onClose();
      })
      .catch((err) => {
        enqueueSnackbar(`Error when creating asset: ${err}`, {
          variant: "error",
        });
      });
  };

  return (
    <Dialog open onClose={onClose} fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">Create a new asset</Typography>

          <IconButton onClick={onClose}>
            <CloseIcon color="disabled" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ height: "100%" }}>
        <QueryWrapper query={query}>
          <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 3 }}>
            <div>
              <Typography sx={{ mb: 1.5 }}>Asset Type:</Typography>
              <Select
                sx={{
                  width: 230,
                  height: 40,
                  borderRadius: 3,
                  paddingTop: 0,
                  fontSize: 20,
                }}
                color="info"
                variant="outlined"
                value={assetTypeId || defaultValue}
                onChange={(e) => setAssetTypeId(e.target.value)}
              >
                {data?.project.asset_types.map((assetType) => (
                  <MenuItem key={assetType.id} value={assetType.id}>
                    {assetType.name}
                  </MenuItem>
                ))}
              </Select>
            </div>

            <div>
              <Typography sx={{ mb: 1.5 }}>Name:</Typography>
              <TextField
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                helperText={
                  inputError && name.length === 0 && "Name can't be empty"
                }
                error={inputError && name.length === 0}
              />
            </div>

            <div>
              <Typography sx={{ mb: 1.5 }}>Description:</Typography>
              <TextField
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={4}
              />
            </div>

            <Button
              variant="contained"
              sx={{ textAlign: "left", color: "white" }}
              color="success"
              onClick={() => {
                if (name.length === 0) {
                  setInputError(true);
                } else {
                  setIsLoading(true);
                  handleClick();
                }
              }}
            >
              Create
              <Collapse
                in={isLoading}
                orientation="horizontal"
                sx={{
                  "& .MuiCollapse-wrapperInner": {
                    display: "flex",
                    justifyContent: "center",
                  },
                }}
              >
                <CircularProgress size={20} sx={{ ml: 2 }} color="inherit" />
              </Collapse>
            </Button>
          </Box>
        </QueryWrapper>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAssetModal;
