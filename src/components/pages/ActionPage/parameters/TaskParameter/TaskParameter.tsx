import { gql, useQuery } from "@apollo/client";
import AddIcon from "@mui/icons-material/Add";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { Alert, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useRouteMatch } from "react-router";

import CreateEntityModal from "~/components/common/CreateEntityModal/CreateEntityModal";
import ProjectSelector from "~/components/common/ProjectSelector/ProjectSelector";
import SearchTextField from "~/components/common/SearchTextField/SearchTextField";
import ArrowDelimiter from "~/components/common/Separator/ArrowDelimiter";
import { useAction, useAuth } from "~/context";
import {
  TaskFileParameter,
  TaskParameter as TaskParameterType,
} from "~/types/action/parameters";
import { Asset, Shot, TaskId } from "~/types/entities";
import { getEntityFullName } from "~/utils/entity";

import AssetsAndShotsView from "./AssetsAndShotsView";
import PublishedFilesView from "./PublishedFilesView";
import TasksView from "./TaskView";

const TASK = gql`
  query task($id: ID!) {
    task(id: $id) {
      entity_id
      project_id

      taskType {
        name
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

type TaskResponse = {
  task: {
    entity_id: string;
    project_id: string;
    entity: Shot | Asset;
    taskType: { name: string };
  };
};

const views = ["entity", "task", "file"] as const;
type View = (typeof views)[number];

/**
 * Returns a formatted list of extensions
 */
const getFilterLabel = (parameter: TaskFileParameter) => {
  const extensions = parameter.type.extensions;
  if (!extensions) return;
  const label = extensions.map((e) => `*${e}`).join(", ");
  return (
    <Typography fontSize={13} color="text.disabled">
      ({label})
    </Typography>
  );
};

interface TaskParameterProps {
  parameter: TaskParameterType;

  /** If we allow selecting files. This brings a third level of view to the component */
  selectFile?: boolean;
}

const TaskParameter = ({
  parameter,
  selectFile,
}: TaskParameterProps): JSX.Element => {
  const [search, setSearch] = useState<string>();
  const [view, setView] = useState<View>("entity");
  const [createEntityModal, setCreateEntityModal] = useState<boolean>(false);
  const [breadCrumbItems, setBreadCrumbItems] = useState<string[]>([]);

  const [selectedProjectId, setSelectedProjectId] = useState<string>();
  const [selectedEntity, setSelectedEntity] = useState<Asset | Shot>();
  const [selectedTaskId, setSelectedTaskId] = useState<TaskId | undefined>(
    parameter.value || undefined
  );
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  /** Set the task id value both on the parameter and in the state */
  const setTaskIdValue = useCallback(
    (value: string | undefined) => {
      parameter.value = value || null;
      setSelectedTaskId(value);
    },
    [parameter]
  );

  useQuery<TaskResponse>(TASK, {
    variables: {
      id: selectedTaskId,
    },
    skip: selectedTaskId === null || selectedTaskId === undefined,
    onCompleted: (data) => {
      setSelectedEntity(data.task.entity);

      if (selectFile) {
        // Only set the task id state when it's a taskFileParameter
        setSelectedTaskId(selectedTaskId);
      } else {
        // Otherwise pre-fill the parameter value
        setTaskIdValue(selectedTaskId);
      }

      if (view !== "file") {
        setView(selectFile ? "file" : "task");

        if (selectFile && !selectedFiles) {
          setBreadCrumbItems([
            ...breadCrumbItems,
            getEntityFullName(data.task.entity),
            data.task.taskType.name,
          ]);
        } else if (!selectedEntity) {
          setBreadCrumbItems([
            ...breadCrumbItems,
            getEntityFullName(data.task.entity),
          ]);
        }
      }
    },
  });

  const actionUUID = useRouteMatch<{ uuid: string }>().params.uuid;
  const auth = useAuth();

  const { actions, sendActionUpdate } = useAction();
  const action = actions[actionUUID].action;

  // Sets the task id value to the current context
  // Used in the submit for example to prefill the parameter
  useEffect(() => {
    if (selectFile) {
      setSelectedTaskId(action.context_metadata.task_id);
    }
  }, [action.context_metadata.task_id, parameter, selectFile, setTaskIdValue]);

  // If not set choose the action context project id or the current project
  const projectId =
    selectedProjectId ||
    action.context_metadata.project_id ||
    window.localStorage.getItem("last-project-id") ||
    auth.currentProjectId;

  const goBack = () => {
    const currentIndex = views.indexOf(view);

    if (currentIndex >= 0) {
      setView(views[currentIndex - 1]);
      setBreadCrumbItems(breadCrumbItems.slice(0, -1));
    }
  };

  const getView = () => {
    switch (view) {
      case "entity":
        return (
          <AssetsAndShotsView
            projectId={projectId as string}
            search={search}
            selectedEntityId={selectedTaskId ? selectedEntity?.id : undefined}
            onEntitySelect={(entity) => {
              setSelectedEntity(entity);
              setView("task");

              setBreadCrumbItems([
                ...breadCrumbItems,
                getEntityFullName(entity),
              ]);
            }}
          />
        );

      case "task":
        return (
          <TasksView
            entity={selectedEntity as Asset | Shot}
            selectedTaskId={selectedTaskId}
            onTaskSelect={(task) => {
              if (selectFile) {
                setSelectedTaskId(task.id);
              } else {
                setTaskIdValue(task.id);
                sendActionUpdate(actionUUID, false);
              }

              if (selectFile) {
                setView("file");
                setBreadCrumbItems([...breadCrumbItems, task.taskType.name]);
              }
            }}
          />
        );
      case "file":
        return (
          <PublishedFilesView
            taskId={selectedTaskId as string}
            onFileSelect={(file) => {
              let newSelection: string[] | string = file;

              if ((parameter as unknown as TaskFileParameter).type.multiple) {
                // If the files is already selected, unselect it
                if (selectedFiles.includes(file)) {
                  const index = selectedFiles.indexOf(file);
                  newSelection = selectedFiles.slice();
                  newSelection.splice(index, 1);
                } else {
                  // Add the file to the selection
                  newSelection = [...selectedFiles, file];
                }
              }

              setSelectedFiles(
                Array.isArray(newSelection) ? newSelection : [newSelection]
              );
              (parameter as unknown as TaskFileParameter).value = newSelection;

              sendActionUpdate(actionUUID, false);
            }}
            filterExtensions={
              (parameter as unknown as TaskFileParameter).type.extensions ||
              undefined
            }
            selectedFiles={selectedFiles}
            selectDirectory={
              (parameter as unknown as TaskFileParameter).type.directory
            }
          />
        );
    }
  };

  if (!projectId) {
    return (
      <Alert variant="outlined" color="error">
        You don{"'"}t have any projects, the task parameter can{"'"}t work...
      </Alert>
    );
  }

  return (
    <div>
      <Grid container sx={{ mb: 1.5, mr: 5 }} spacing={1}>
        {/* Project selector */}
        <Grid item xs>
          <ProjectSelector
            small
            value={projectId}
            disabled={action.context_metadata.project_id !== undefined}
            onChange={(e) => {
              setSelectedProjectId(e.target.value);
              setTaskIdValue(undefined);
              setView("entity");
              setBreadCrumbItems([]);
            }}
          />
        </Grid>

        {/* Search bar */}
        <Grid item xs={5}>
          <SearchTextField
            variant="outlined"
            placeholder="Search..."
            size="small"
            value={search === undefined ? "" : search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
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

        {view !== "entity" && (
          <Grid item xs>
            {/* Go back button */}
            <IconButton sx={{ ml: "auto" }} onClick={goBack}>
              <KeyboardReturnIcon />
            </IconButton>
          </Grid>
        )}
      </Grid>

      <div>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          {/* Sequence and shot name */}
          <div style={{ display: "flex", alignItems: "center" }}>
            {breadCrumbItems.map((nav, i) => (
              <div key={i}>
                <Typography
                  display="inline-block"
                  fontSize={16}
                  color={`rgba(255, 255, 255, ${
                    i === breadCrumbItems.length - 1 ? 0.8 : 0.5
                  })`}
                >
                  {nav}
                </Typography>
                {i !== breadCrumbItems.length - 1 && (
                  <ArrowDelimiter key={`${i}-del`} />
                )}
              </div>
            ))}
          </div>

          {view === "file" &&
            getFilterLabel(parameter as unknown as TaskFileParameter)}
        </div>

        {/* Display the entity/task/file view */}
        {getView()}
      </div>

      {/* Entity creating modal when clicking on + button */}
      {createEntityModal && ["entity", "task"].includes(view) && (
        <CreateEntityModal
          targetEntity={selectedEntity}
          onClose={() => setCreateEntityModal(false)}
          entityType={view === "task" ? "Task" : "Shot"}
          entityTypes={view === "entity" ? ["Asset", "Shot"] : undefined}
          projectId={projectId}
        />
      )}
    </div>
  );
};

export default TaskParameter;
