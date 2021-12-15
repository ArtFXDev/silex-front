import AddIcon from "@mui/icons-material/Add";
import AirIcon from "@mui/icons-material/Air";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import {
  Alert,
  Box,
  Fade,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import CreateEntityModal from "components/common/CreateEntityModal/CreateEntityModal";
import SearchTextField from "components/common/SearchTextField/SearchTextField";
import { useAction, useAuth } from "context";
import { useState } from "react";
import { useRouteMatch } from "react-router";
import { Asset, Shot, TaskId } from "types/entities";
import { getColorFromString } from "utils/color";
import { formatUnderScoreStringWithSpaces } from "utils/string";

import AssetsAndShotsView from "./AssetsAndShotsView";
import TasksView from "./TaskView";

interface TaskParameterProps {
  onTaskSelect: (newTaskId: string) => void;
}

const TaskParameter = ({ onTaskSelect }: TaskParameterProps): JSX.Element => {
  const [search, setSearch] = useState<string>();
  const [taskView, setTaskView] = useState<boolean>();
  const [selectedEntity, setSelectedEntity] = useState<Shot | Asset>();
  const [selectedTaskId, setSelectedTaskId] = useState<TaskId>();
  const [createEntityModal, setCreateEntityModal] = useState<boolean>(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>();

  const routeMatch = useRouteMatch<{ uuid: string }>();
  const auth = useAuth();

  const { actions } = useAction();
  const action = actions[routeMatch.params.uuid];

  // If not set choose the action context project id or the current project
  const projectId =
    selectedProjectId ||
    action.context_metadata.project_id ||
    auth.currentProjectId;

  if (!projectId) {
    return (
      <Alert variant="outlined" color="error">
        You don{"'"}t have any projects, the task parameter can{"'"}t work...
      </Alert>
    );
  }

  return (
    <div>
      <Grid container sx={{ mb: 3, mr: 5 }} spacing={1}>
        <Grid item xs>
          <Select
            disabled={action.context_metadata.project_id !== undefined}
            sx={{
              width: "auto",
              height: 40,
              borderRadius: 3,
              fontSize: 16,
            }}
            variant="outlined"
            value={projectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            color="info"
          >
            {auth.projects &&
              auth.projects
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((project) => {
                  const projectColor = getColorFromString(project.name);

                  return (
                    <MenuItem
                      key={project.id}
                      value={project.id}
                      sx={{ color: projectColor }}
                    >
                      <Fade in>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            textOverflow: "ellipsis",
                          }}
                        >
                          <AirIcon
                            sx={{ color: projectColor, mr: 1 }}
                            fontSize="small"
                          />
                          {formatUnderScoreStringWithSpaces(project.name)}
                        </Box>
                      </Fade>
                    </MenuItem>
                  );
                })}
          </Select>
        </Grid>

        <Grid item xs={5}>
          <SearchTextField
            variant="outlined"
            placeholder="Search..."
            size="small"
            value={search === undefined ? "" : search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>

        <Grid item xs>
          <Tooltip title="Add" placement="top" arrow>
            <IconButton
              onClick={() => {
                setCreateEntityModal(true);
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>

      {taskView && selectedEntity ? (
        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography>
              {selectedEntity.type === "Shot"
                ? `${selectedEntity.sequence.name} - ${selectedEntity.name}`
                : selectedEntity.name}
            </Typography>

            <IconButton sx={{ ml: "auto" }} onClick={() => setTaskView(false)}>
              <KeyboardReturnIcon />
            </IconButton>
          </div>

          <TasksView
            entity={selectedEntity}
            selectedTaskId={selectedTaskId}
            setSelectedTaskId={(newTaskId) => {
              onTaskSelect(newTaskId);
              setSelectedTaskId(newTaskId);
            }}
          />
        </div>
      ) : (
        <AssetsAndShotsView
          projectId={projectId}
          search={search}
          selectedEntity={selectedTaskId ? selectedEntity : undefined}
          onEntityClick={(entity) => {
            setSelectedEntity(entity);
            setTaskView(true);
          }}
        />
      )}

      {createEntityModal && (
        <CreateEntityModal
          onClose={() => setCreateEntityModal(false)}
          entityType={taskView && selectedEntity ? "Task" : "Shot"}
          projectId={action.context_metadata.project_id}
          targetEntity={selectedEntity}
        />
      )}
    </div>
  );
};

export default TaskParameter;
