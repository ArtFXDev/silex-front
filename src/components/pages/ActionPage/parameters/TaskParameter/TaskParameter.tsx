import AddIcon from "@mui/icons-material/Add";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { Alert, IconButton, Typography } from "@mui/material";
import CreateEntityModal from "components/common/CreateEntityModal/CreateEntityModal";
import SearchTextField from "components/common/SearchTextField/SearchTextField";
import { useAction } from "context";
import { useState } from "react";
import { useRouteMatch } from "react-router";
import { Asset, Shot, TaskId } from "types/entities";

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

  const routeMatch = useRouteMatch<{ uuid: string }>();

  const { actions } = useAction();
  const action = actions[routeMatch.params.uuid];

  if (!action.context_metadata.project_id) {
    return (
      <Alert variant="outlined" color="warning">
        You didn{"'"}t run this action in a proper context. The project_id is
        missing...
      </Alert>
    );
  }

  return (
    <div>
      <SearchTextField
        variant="outlined"
        placeholder="Search..."
        size="small"
        value={search === undefined ? "" : search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mr: 3, mb: 3 }}
      />

      <IconButton
        onClick={() => {
          setCreateEntityModal(true);
        }}
      >
        <AddIcon />
      </IconButton>

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
          search={search}
          action={action}
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
