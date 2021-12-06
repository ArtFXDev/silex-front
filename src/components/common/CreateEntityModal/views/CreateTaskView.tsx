/* eslint-disable camelcase */
import { gql, useApolloClient, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import QueryWrapper from "components/utils/QueryWrapper/QueryWrapper";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { Asset, Sequence, Shot } from "types/entities";
import * as Zou from "utils/zou";

// Used for styling the Select input
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const ASSET_TASK_TYPES = gql`
  query TaskTypesForProject($id: ID!) {
    project(id: $id) {
      task_types {
        id
        name
        for_shots
      }
    }
  }
`;

interface CreateTaskViewProps {
  targetEntity: Shot | Asset | Sequence;
  onClose: () => void;
  projectIdOverride?: string;
}

const CreateTaskView = ({
  targetEntity,
  onClose,
  projectIdOverride,
}: CreateTaskViewProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  const projectIdFromURL =
    useRouteMatch<{ projectId: string }>().params.projectId;
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

  const handleSelect = (e: SelectChangeEvent<typeof selectedTaskIds>) => {
    const value = e.target.value;
    const newValues = typeof value === "string" ? value.split(",") : value;
    setSelectedTaskIds(newValues);
  };

  const onCreateTasks = () => {
    setIsLoading(true);

    Promise.all(
      selectedTaskIds.map((taskId) =>
        Zou.createTask(projectId, taskId, targetEntity.type, targetEntity.id)
      )
    )
      .then(() => {
        enqueueSnackbar(
          `Created tasks: ${data?.project.task_types
            .filter((t) => selectedTaskIds.includes(t.id))
            .map((t) => t.name)
            .join(", ")}`,
          {
            variant: "success",
          }
        );

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

  const filteredTaskTypes = data?.project.task_types.filter(
    (t) =>
      (targetEntity.type === "Shot" ? t.for_shots : !t.for_shots) &&
      !targetEntity.tasks.map((task) => task.taskType.id).includes(t.id)
  );

  return (
    <QueryWrapper query={query}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <div>
          <Typography variant="h6" color="text.disabled" sx={{ mb: 1.5 }}>
            {targetEntity.type}: {targetEntity.name}
          </Typography>

          {filteredTaskTypes && filteredTaskTypes.length > 0 ? (
            <>
              <Typography sx={{ mb: 1.5 }}>Select task(s): </Typography>

              <Select
                sx={{
                  width: "100%",
                  borderRadius: 3,
                  paddingTop: 0,
                  fontSize: 15,
                }}
                color="info"
                variant="outlined"
                value={selectedTaskIds}
                multiple
                onChange={handleSelect}
                MenuProps={MenuProps}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((taskTypeId) => {
                      const taskType = data?.project.task_types.find(
                        (t) => t.id === taskTypeId
                      ) as { id: string; name: string };
                      return <Chip key={taskType.id} label={taskType.name} />;
                    })}
                  </Box>
                )}
              >
                {filteredTaskTypes.map((taskType) => (
                  <MenuItem key={taskType.id} value={taskType.id}>
                    {taskType.name}
                  </MenuItem>
                ))}
              </Select>
            </>
          ) : (
            <Typography color="text.disabled">
              No more tasks to add...
            </Typography>
          )}
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
    </QueryWrapper>
  );
};

export default CreateTaskView;
