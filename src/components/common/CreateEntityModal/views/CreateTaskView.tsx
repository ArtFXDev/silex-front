import { gql, useApolloClient, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useParams } from "react-router-dom";

import QueryWrapper from "~/components/utils/QueryWrapper/QueryWrapper";
import * as Zou from "~/utils/zou";

import { TargetEntity } from "../CreateEntityModal";

const ASSET_TASK_TYPES = gql`
  query TaskTypesForProject($id: ID!) {
    project(id: $id) {
      id

      task_types {
        id
        name
        for_shots
      }
    }
  }
`;

interface CreateTaskViewProps {
  targetEntity: TargetEntity;
  onClose: () => void;
  projectIdOverride?: string;
}

const CreateTaskView = ({
  targetEntity,
  onClose,
  projectIdOverride,
}: CreateTaskViewProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedTaskTypeId, setSelectedTaskTypeId] = useState<string>("");
  const [taskName, setTaskName] = useState<string>("main");

  const projectIdFromURL = useParams<{ projectId: string }>()
    .projectId as string;
  const projectId = projectIdOverride || projectIdFromURL;
  const { enqueueSnackbar } = useSnackbar();
  const client = useApolloClient();

  const query = useQuery<{
    project: {
      task_types: { id: string; name: string; for_shots: boolean }[];
    };
  }>(ASSET_TASK_TYPES, {
    variables: { id: projectId },
  });

  const { data } = query;

  if (data) {
    const filteredTaskTypes = data.project.task_types.filter((t) =>
      targetEntity.type === "Shot" ? t.for_shots : !t.for_shots
    );

    if (filteredTaskTypes && selectedTaskTypeId.length === 0) {
      setSelectedTaskTypeId(filteredTaskTypes[0].id);
    }
  }

  const onCreateTasks = () => {
    setIsLoading(true);

    Zou.createTask(
      projectId,
      selectedTaskTypeId,
      targetEntity.type,
      targetEntity.id,
      taskName
    )
      .then(() => {
        enqueueSnackbar(`Created task: ${selectedTaskTypeId}`, {
          variant: "success",
        });

        // Refresh GraphQL queries
        client.refetchQueries({ include: "active" });

        onClose();
      })
      .catch((err) => {
        enqueueSnackbar(`Error when creating tasks: ${err}`, {
          variant: "error",
        });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <QueryWrapper
      query={query}
      render={(data) => {
        const filteredTaskTypes = data.project.task_types.filter((t) =>
          targetEntity.type === "Shot" ? t.for_shots : !t.for_shots
        );

        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <div>
              {filteredTaskTypes && (
                <>
                  <Typography sx={{ mb: 1.5 }}>Select task type: </Typography>

                  <Select
                    sx={{
                      width: 150,
                      height: 40,
                      borderRadius: 3,
                    }}
                    value={selectedTaskTypeId}
                    onChange={(e) => setSelectedTaskTypeId(e.target.value)}
                    color="success"
                    variant="outlined"
                  >
                    {filteredTaskTypes.map((taskType) => (
                      <MenuItem key={taskType.id} value={taskType.id}>
                        {taskType.name}
                      </MenuItem>
                    ))}
                  </Select>
                </>
              )}
            </div>

            <div>
              <Typography sx={{ mb: 1.5 }}>Subtask name: </Typography>
              <TextField
                fullWidth
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
            </div>

            <Button
              variant="contained"
              sx={{ textAlign: "left", color: "white" }}
              color="success"
              onClick={onCreateTasks}
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
        );
      }}
    />
  );
};

export default CreateTaskView;
