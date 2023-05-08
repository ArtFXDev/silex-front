import { gql, useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import { Route, Routes, useParams } from "react-router-dom";

import QueryWrapper from "~/components/utils/QueryWrapper/QueryWrapper";
import { Asset, Shot } from "~/types/entities";
import { fuzzyMatch } from "~/utils/string";

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
      render_time

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
  const routeParams = useParams<{ category: string; entityId: string }>();

  const query = useQuery<{ shot?: Shot; asset?: Asset }>(
    routeParams.category === "shots" ? SHOT_TASKS : ASSET_TASKS,
    {
      variables: { id: routeParams.entityId },
    }
  );

  return (
    <QueryWrapper
      query={query}
      render={(data) => {
        // Force entity to be one of both types
        const entity = (data.asset || data.shot) as Shot | Asset;

        return (
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
                This {data.asset ? "asset" : "shot"} doesn{"'"}t have any
                tasks...
              </Typography>
            )}

            <Routes>
              <Route path=":taskId" element={<TaskModal />} />
            </Routes>
          </>
        );
      }}
    />
  );
};

export default TasksView;
