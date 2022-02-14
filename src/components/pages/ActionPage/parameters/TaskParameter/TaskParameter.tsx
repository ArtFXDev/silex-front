/* eslint-disable camelcase */
import { gql, useQuery } from "@apollo/client";
import AddIcon from "@mui/icons-material/Add";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { Alert, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import CreateEntityModal from "components/common/CreateEntityModal/CreateEntityModal";
import ProjectSelector from "components/common/ProjectSelector/ProjectSelector";
import SearchTextField from "components/common/SearchTextField/SearchTextField";
import ArrowDelimiter from "components/common/Separator/ArrowDelimiter";
import { useAction, useAuth } from "context";
import { useState } from "react";
import { useRouteMatch } from "react-router";
import {
  TaskFileParameter,
  TaskParameter as TaskParameterType,
} from "types/action/parameters";
import { Asset, Shot, TaskId } from "types/entities";
import { getEntityFullName } from "utils/entity";

import AssetsAndShotsView from "./AssetsAndShotsView";
import PublishedFilesView from "./PublishedFilesView";
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

const views = ["entity", "task", "file"] as const;
type View = typeof views[number];

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
  const [selectedFilePath, setSelectedFilePath] = useState<string>();

  /** Set the task id value both on the parameter and in the state */
  const setTaskIdValue = (value: string | undefined) => {
    parameter.value = value || null;
    setSelectedTaskId(value);
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
    skip: selectedTaskId === null || selectedTaskId === undefined,
    onCompleted: (data) => {
      setSelectedEntity(data.task.entity);
      setTaskIdValue(selectedTaskId);

      if (view !== "file") {
        setView("task");
        setBreadCrumbItems([
          ...breadCrumbItems,
          getEntityFullName(data.task.entity),
        ]);
      }
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

  const goBack = () => {
    const currentIndex = views.indexOf(view);

    if (currentIndex >= 0) {
      setView(views[currentIndex - 1]);
      setBreadCrumbItems(breadCrumbItems.slice(0, -1));
    }
  };

  const getFilterLabel = () => {
    const extensions = (parameter as unknown as TaskFileParameter).type
      .extensions;
    if (!extensions) return;
    const label = extensions.map((e) => `*${e}`).join(", ");
    return (
      <Typography fontSize={13} color="text.disabled">
        ({label})
      </Typography>
    );
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
              parameter.value = file;
              setSelectedFilePath(file);
              sendActionUpdate(actionUUID, false);
            }}
            filterExtensions={
              (parameter as unknown as TaskFileParameter).type.extensions ||
              undefined
            }
            selectedFilePath={selectedFilePath}
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

          {view === "file" && getFilterLabel()}
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
