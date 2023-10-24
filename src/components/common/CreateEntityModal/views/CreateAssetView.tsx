import { gql, useApolloClient, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  FormControlLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useParams } from "react-router-dom";

import QueryWrapper from "~/components/utils/QueryWrapper/QueryWrapper";
import * as Zou from "~/utils/zou";

const ASSET_TASK_TYPES = gql`
  query AssetAndTaskTypesForProject($id: ID!) {
    project(id: $id) {
      id

      asset_types {
        id
        name
      }

      task_types {
        id
        name
        for_shots
      }
    }
  }
`;

type AssetAndTaskTypesResponse = {
  project: {
    asset_types: { id: string; name: string }[];
    task_types: { id: string; name: string; for_shots: boolean }[];
  };
};

interface CreateAssetViewProps {
  defaultCategory?: string;
  onClose: () => void;
  projectIdOverride?: string;
}

const CreateAssetView = ({
  defaultCategory,
  onClose,
  projectIdOverride,
}: CreateAssetViewProps): JSX.Element => {
  const [assetTypeId, setAssetTypeId] = useState<string>(defaultCategory || "");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [inputError, setInputError] = useState<boolean>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [autoCreateTasks, setAutoCreateTasks] = useState<boolean>(true);

  const projectIdFromURL = useParams<{ projectId: string }>()
    .projectId as string;
  const projectId = projectIdOverride || projectIdFromURL;
  console.log(projectIdFromURL);

  const client = useApolloClient();
  const { enqueueSnackbar } = useSnackbar();

  const query = useQuery<AssetAndTaskTypesResponse>(ASSET_TASK_TYPES, {
    variables: { id: projectId },
  });
  const { data } = query;

  // Set the asset type id to be the first element by default
  if (data && !assetTypeId) {
    setAssetTypeId(
      data.project.asset_types
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))[0].id
    );
  }

  const handleClick = () => {
    if (data) {
      Zou.createAsset(projectId, assetTypeId, {
        data: {},
        description,
        /* eslint-disable-next-line camelcase */
        episode_id: null,
        name,
      })
        .then((response) => {
          // Create all the available tasks for that asset
          if (autoCreateTasks) {
            return Promise.all(
              data.project.task_types
                .filter((t) => !t.for_shots)
                .map((taskType) =>
                  Zou.createTask(
                    projectId,
                    taskType.id,
                    "Asset",
                    response.data.id
                  )
                )
            );
          }
        })
        .then(() => {
          enqueueSnackbar(`Created asset: ${name}`, {
            variant: "success",
          });

          // Refresh GraphQL cache to refetch assets
          client.refetchQueries({ include: "active" });

          // Close the window
          onClose();
        })
        .catch((err) => {
          enqueueSnackbar(`Error when creating asset: ${err}`, {
            variant: "error",
          });
        });
    }
  };

  return (
    <QueryWrapper
      query={query}
      render={(data) => (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
              value={assetTypeId}
              onChange={(e) => setAssetTypeId(e.target.value)}
            >
              {data.project.asset_types
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((assetType) => (
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

          <FormControlLabel
            sx={{ color: "text.disabled" }}
            control={<Switch color="info" checked={autoCreateTasks} />}
            onChange={() => setAutoCreateTasks(!autoCreateTasks)}
            label="Automatically create all tasks"
          />

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
                "&.MuiCollapse-wrapperInner": {
                  display: "flex",
                  justifyContent: "center",
                },
              }}
            >
              <CircularProgress size={20} sx={{ ml: 2 }} color="inherit" />
            </Collapse>
          </Button>
        </Box>
      )}
    />
  );
};

export default CreateAssetView;
