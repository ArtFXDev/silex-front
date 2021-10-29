import { gql, useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import QueryWrapper from "components/utils/QueryWrapper/QueryWrapper";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import { Asset, Shot } from "types/entities";
import { fuzzyMatch } from "utils/string";

import EntitiesView from "./EntitiesView";
import TaskModal from "./TaskModal/TaskModal";

const TASK_FIELDS = gql`
  fragment TaskFields on Task {
    id
    type

    assignees {
      id
      full_name
      has_avatar
    }

    taskType {
      name
    }

    taskStatus {
      short_name
      color
    }

    previews {
      id
    }
  }
`;

const SHOT_TASKS = gql`
  ${TASK_FIELDS}
  query getShotTasks($id: ID!) {
    shot(id: $id) {
      name
      type

      sequence {
        name
      }

      tasks {
        ...TaskFields
      }
    }
  }
`;

const ASSET_TASKS = gql`
  ${TASK_FIELDS}
  query getAssetTasks($id: ID!) {
    asset(id: $id) {
      name
      type

      tasks {
        ...TaskFields
      }
    }
  }
`;

interface TasksViewProps {
  listView: boolean;
  search: string;
}

const TasksView = ({ listView, search }: TasksViewProps): JSX.Element => {
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
          {entity.type === "Shot" && (
            <Typography
              variant="h6"
              color="text.disabled"
              display="inline-block"
              sx={{
                mr: 1,
                transition: "all 0.2s ease",
                cursor: "pointer",
                ":hover": { color: "rgba(255, 255, 255, 0.8)" },
              }}
              onClick={() => history.goBack()}
            >
              {entity.sequence.name} /{" "}
            </Typography>
          )}

          <h2
            style={{
              marginBottom: 0,
              marginTop: 0,
              display: "inline-block",
            }}
          >
            {entity.name}
          </h2>

          <EntitiesView
            entities={entity.tasks.filter((task) =>
              fuzzyMatch(task.taskType.name, search)
            )}
            listView={listView}
          />
        </div>
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
