/* eslint-disable camelcase */
import { gql, useQuery } from "@apollo/client";
import AddIcon from "@mui/icons-material/Add";
import AirIcon from "@mui/icons-material/Air";
import {
  Alert,
  Fade,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import CreateEntityModal from "components/common/CreateEntityModal/CreateEntityModal";
import SearchTextField from "components/common/SearchTextField/SearchTextField";
import { useAction, useAuth } from "context";
import { useState } from "react";
import { useRouteMatch } from "react-router";
import { TaskParameter as TaskParameterType } from "types/action/parameters";
import { Asset, Shot, TaskId } from "types/entities";
import { getColorFromString } from "utils/color";
import { formatUnderScoreStringWithSpaces } from "utils/string";

import AssetsAndShotsView from "./AssetsAndShotsView";
import TasksView from "./TaskView";

const TASK = gql`
  query task($id: ID!) {
    task(id: $id) {
      entity_id
      project_id

      taskType {
        for_shots
      }

      entity {
        ... on Shot {
          id
          name
          type

          sequence {
            id
            name
          }
        }

        ... on Asset {
          id
          name
          type
        }
      }
    }
  }
`;

interface TaskParameterProps {
  parameter: TaskParameterType;
}

const TaskParameter = ({ parameter }: TaskParameterProps): JSX.Element => {
  const [search, setSearch] = useState<string>();
  const [taskView, setTaskView] = useState<boolean>();
  const [selectedEntity, setSelectedEntity] = useState<Asset | Shot>();
  const [selectedTaskId, setSelectedTaskId] = useState<TaskId | null>(
    parameter.value
  );
  const [createEntityModal, setCreateEntityModal] = useState<boolean>(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>();

  const setTaskIdValue = (newTaskId: TaskId | null) => {
    setSelectedTaskId(newTaskId);
    parameter.value = newTaskId;
  };

  useQuery<{
    task: {
      entity_id: string;
      project_id: string;
      entity: Shot | Asset;
    };
  }>(TASK, {
    variables: {
      id: selectedTaskId,
    },
    skip: selectedTaskId === null,
    onCompleted: (data) => {
      setSelectedEntity(data.task.entity);
      setTaskView(true);
      setTaskIdValue(selectedTaskId);
    },
  });

  const actionUUID = useRouteMatch<{ uuid: string }>().params.uuid;
  const auth = useAuth();

  const { actions, sendActionUpdate } = useAction();
  const action = actions[actionUUID].action;

  // If not set choose the action context project id or the current project
  const projectId =
    selectedProjectId ||
    action.context_metadata.project_id ||
    window.localStorage.getItem("last-project-id") ||
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
        {/* Project selector */}
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
            onChange={(e) => {
              setSelectedProjectId(e.target.value);
              setTaskIdValue(null);
              setTaskView(false);
            }}
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
                        <div
                          style={{
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
                        </div>
                      </Fade>
                    </MenuItem>
                  );
                })}
          </Select>
        </Grid>

        {/* Search bar */}
        <Grid item xs={5}>
          <SearchTextField
            variant="outlined"
            placeholder="Search..."
            size="small"
            value={search === undefined ? "" : search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>

        {/* Add new entity + button */}
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
        <TasksView
          entity={selectedEntity}
          onExit={() => setTaskView(false)}
          selectedTaskId={selectedTaskId}
          setSelectedTaskId={(newTaskId) => {
            setTaskIdValue(newTaskId);
            parameter.value = newTaskId;

            sendActionUpdate(actionUUID, false);
          }}
        />
      ) : (
        <AssetsAndShotsView
          projectId={projectId}
          search={search}
          selectedEntityId={selectedTaskId ? selectedEntity?.id : undefined}
          onEntityClick={(entity) => {
            setSelectedEntity(entity);
            setTaskView(true);
          }}
        />
      )}

      {createEntityModal && (
        <CreateEntityModal
          targetEntity={selectedEntity}
          onClose={() => setCreateEntityModal(false)}
          entityType={taskView ? "Task" : "Shot"}
          entityTypes={!taskView ? ["Asset", "Shot"] : undefined}
          projectId={projectId}
        />
      )}
    </div>
  );
};

export default TaskParameter;
