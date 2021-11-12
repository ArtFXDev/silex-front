import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { Alert, IconButton, Typography } from "@mui/material";
import SearchTextField from "components/common/SearchTextField/SearchTextField";
import { useAction } from "context";
import { useState } from "react";
import { Action } from "types/action/action";
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

  const actionContext = useAction();
  const action = actionContext.action as Action;

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

      {taskView && selectedEntity ? (
        <div>
          <div style={{ display: "flex" }}>
            <Typography>{selectedEntity.name}</Typography>

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
    </div>
  );
};

export default TaskParameter;
