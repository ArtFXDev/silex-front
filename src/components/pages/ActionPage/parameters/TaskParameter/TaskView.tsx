import { gql, useQuery } from "@apollo/client";
import {
  Fade,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
} from "@mui/material";
import QueryWrapper from "components/utils/QueryWrapper/QueryWrapper";
import { LIST_ITEM_BORDER_RADIUS } from "style/constants";
import { Asset, Shot, TaskId } from "types/entities";

const TASK_FIELDS = gql`
  fragment TaskFields on Task {
    id
    type

    taskType {
      id
      name
      priority
    }
  }
`;

const SHOT_TASKS = gql`
  ${TASK_FIELDS}
  query Tasks($id: ID!) {
    shot(id: $id) {
      tasks {
        ...TaskFields
      }
    }
  }
`;

const ASSET_TASKS = gql`
  ${TASK_FIELDS}
  query Tasks($id: ID!) {
    asset(id: $id) {
      tasks {
        ...TaskFields
      }
    }
  }
`;

interface TaskViewProps {
  /** Entity for which we want to see the tasks */
  entity: Shot | Asset;

  /** Id of the entity that is selected */
  selectedTaskId: TaskId | undefined;

  /** Setter for the task id (managed by the parent component) */
  setSelectedTaskId: (newId: TaskId) => void;
}

const TasksView = ({
  entity,
  selectedTaskId,
  setSelectedTaskId,
}: TaskViewProps): JSX.Element => {
  const query = useQuery<{ shot?: Shot; asset?: Asset }>(
    entity.type === "Shot" ? SHOT_TASKS : ASSET_TASKS,
    {
      variables: {
        id: entity.id,
      },
    }
  );
  const { data } = query;

  const entityFetch = data?.asset || data?.shot;

  return (
    <QueryWrapper query={query}>
      {entityFetch && (
        <List>
          {entityFetch.tasks
            .slice() // Copy list since sort mutates
            .sort((a, b) => a.taskType.priority - b.taskType.priority)
            .map((task, i) => (
              <Fade key={task.id} in timeout={{ appear: 2000 * i, enter: 800 }}>
                <Paper
                  elevation={4}
                  sx={{ my: 1, borderRadius: LIST_ITEM_BORDER_RADIUS }}
                >
                  <ListItem disablePadding>
                    <ListItemButton
                      sx={{ borderRadius: LIST_ITEM_BORDER_RADIUS, py: 0.5 }}
                      selected={task.id === selectedTaskId}
                      onClick={() => setSelectedTaskId(task.id)}
                    >
                      <ListItemText
                        primaryTypographyProps={{ fontSize: 15 }}
                        primary={task.taskType.name}
                      />
                    </ListItemButton>
                  </ListItem>
                </Paper>
              </Fade>
            ))}
        </List>
      )}
    </QueryWrapper>
  );
};

export default TasksView;
