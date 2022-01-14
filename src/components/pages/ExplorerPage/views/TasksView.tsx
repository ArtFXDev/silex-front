import { gql, useQuery } from "@apollo/client";
import AddIcon from "@mui/icons-material/Add";
import { IconButton, Typography } from "@mui/material";
import CreateEntityModal from "components/common/CreateEntityModal/CreateEntityModal";
import QueryWrapper from "components/utils/QueryWrapper/QueryWrapper";
import { useState } from "react";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import { Asset, Shot } from "types/entities";
import { fuzzyMatch } from "utils/string";

import EntitiesView from "./EntitiesView";
import TaskModal from "./TaskModal/TaskModal";

const TASK_FIELDS = gql`
  fragment TasksFields on Task {
    id
    name
    type

    assignees {
      id
      full_name
      has_avatar
    }

    taskType {
      id
      name
      priority
      color
    }

    taskStatus {
      id
      short_name
      color
    }

    previews {
      id
      extension
      revision
    }
  }
`;

const SHOT_TASKS = gql`
  ${TASK_FIELDS}
  query TasksForAssetOrShot($id: ID!) {
    shot(id: $id) {
      id
      name
      type

      sequence {
        id
        name
      }

      tasks {
        ...TasksFields
      }
    }
  }
`;

const ASSET_TASKS = gql`
  ${TASK_FIELDS}
  query TasksForAssetOrShot($id: ID!) {
    asset(id: $id) {
      id
      name
      type

      entity_type {
        id
        name
      }

      tasks {
        ...TasksFields
      }
    }
  }
`;

interface TasksViewProps {
  listView: boolean;
  search: string;
}

const TasksView = ({ listView, search }: TasksViewProps): JSX.Element => {
  const [createTaskModal, setCreateTaskModal] = useState<boolean>(false);

  const routeMatch = useRouteMatch<{ category: string; entityId: string }>();
  const history = useHistory();

  const query = useQuery<{ shot?: Shot; asset?: Asset }>(
    routeMatch.params.category === "shots" ? SHOT_TASKS : ASSET_TASKS,
    {
      variables: { id: routeMatch.params.entityId },
    }
  );
  const { data } = query;

  // Force entity to be one of both types
  const entity = (data?.asset || data?.shot) as Shot | Asset;

  return (
    <QueryWrapper query={query}>
      {data && (
        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>
              <Typography
                variant="h6"
                color="text.disabled"
                display="inline-block"
                sx={{
                  verticalAlign: "text-top",
                  mr: 1,
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                  ":hover": { color: "rgba(255, 255, 255, 0.8)" },
                }}
                onClick={() =>
                  history.push(
                    window.location.pathname.split("/").slice(0, -2).join("/")
                  )
                }
              >
                {entity.type === "Shot"
                  ? entity.sequence.name
                  : entity.entity_type.name}
              </Typography>

              <Typography
                variant="h6"
                display="inline-block"
                color="text.disabled"
                mr={1}
                style={{ verticalAlign: "text-top" }}
              >
                /
              </Typography>
            </div>

            <h2
              style={{
                display: "inline-block",
                marginBottom: 0,
                marginTop: 0,
              }}
            >
              {entity.name}
            </h2>

            <IconButton
              sx={{ ml: 1.5 }}
              onClick={() => setCreateTaskModal(true)}
            >
              <AddIcon />
            </IconButton>
          </div>

          {entity.tasks.length > 0 ? (
            <EntitiesView
              entities={entity.tasks
                .filter((task) => fuzzyMatch(task.taskType.name, search))
                .sort((a, b) => a.taskType.priority - b.taskType.priority)}
              listView={listView}
            />
          ) : (
            <Typography color="text.disabled" sx={{ mt: 4 }}>
              This {data.asset ? "asset" : "shot"} doesn{"'"}t have any tasks...
            </Typography>
          )}
        </div>
      )}

      {createTaskModal && (
        <CreateEntityModal
          targetEntity={entity}
          onClose={() => setCreateTaskModal(false)}
          entityType="Task"
        />
      )}

      <Switch>
        <Route path={`/explorer/:projectId/:category/:entityId/tasks/:taskId`}>
          <TaskModal />
        </Route>
      </Switch>
    </QueryWrapper>
  );
};

export default TasksView;
