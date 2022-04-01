import { gql, useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import QueryWrapper from "components/utils/QueryWrapper/QueryWrapper";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { Asset, Shot } from "types/entities";
import { fuzzyMatch } from "utils/string";

import EntitiesView from "./EntitiesView";
import EntityHeader from "./EntityHeader/EntityHeader";
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

      nb_frames
      fps

      validation {
        id
        frame_set
        total
      }

      validation_history {
        id
        created_at
        total
      }

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
        <>
          <EntityHeader entity={entity} />

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
        </>
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
