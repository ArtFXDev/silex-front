import { useRouteMatch, Route, Switch } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

import { Shot, Asset } from "types";
import QueryWrapper from "components/QueryWrapper/QueryWrapper";
import EntitiesView from "./EntitiesView";
import TaskModal from "./TaskModal";

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
  }
`;

const SHOT_TASKS = gql`
  ${TASK_FIELDS}
  query getShotTasks($id: ID!) {
    shot(id: $id) {
      name
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
      tasks {
        ...TaskFields
      }
    }
  }
`;

const TasksView: React.FC<{ listView: boolean }> = ({ listView }) => {
  const routeMatch = useRouteMatch<{ category: string; entityId: string }>();

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
          <h2 style={{ marginBottom: 0, marginTop: 0 }}>{entity.name}</h2>
          <EntitiesView entities={entity.tasks} listView={listView} />
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
