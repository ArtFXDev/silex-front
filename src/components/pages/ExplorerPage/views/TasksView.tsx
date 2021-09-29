import { useState } from "react";
import { useLocation } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

import { Shot, Asset } from "types";
import QueryWrapper from "components/QueryWrapper/QueryWrapper";
import EntitiesView from "./EntitiesView";
import TaskModal from "./TaskModal";

const TASK_FIELDS = gql`
  fragment TaskFields on Task {
    id
    type

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
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalTaskId, setModalTaskId] = useState<string>();

  const openTaskModal = (taskId: string): void => {
    setOpenModal(true);
    setModalTaskId(taskId);
  };

  const location = useLocation();

  const tokens = location.pathname.split("/").filter((e) => e.length !== 0);
  const lastId = tokens[tokens.length - 1];

  const isShot = location.pathname.includes("shot");

  const query = useQuery<{ shot?: Shot; asset?: Asset }>(
    isShot ? SHOT_TASKS : ASSET_TASKS,
    {
      variables: { id: lastId },
    }
  );
  const { data } = query;

  // Force entity to be one of both types
  const entity = (data?.asset || data?.shot) as Shot | Asset;

  return (
    <QueryWrapper query={query}>
      {openModal && (
        <TaskModal
          taskId={modalTaskId as string}
          onClose={() => setOpenModal(false)}
        />
      )}

      {data && (
        <div>
          <h2 style={{ marginBottom: 0, marginTop: 0 }}>{entity.name}</h2>
          <EntitiesView
            entities={entity.tasks}
            listView={listView}
            openTaskModal={openTaskModal}
          />
        </div>
      )}
    </QueryWrapper>
  );
};

export default TasksView;
