import { gql, useQuery } from "@apollo/client";
import {
  Fade,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Theme,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { SxProps } from "@mui/system";

import ColoredCircle from "~/components/common/ColoredCircle/ColoredCircle";
import QueryWrapper from "~/components/utils/QueryWrapper/QueryWrapper";
import { LIST_ITEM_BORDER_RADIUS } from "~/style/constants";
import { Asset, Shot, Task, TaskId } from "~/types/entities";

const TASK_FIELDS = gql`
  fragment TaskFieldsParam on Task {
    id
    type
    name

    taskType {
      id
      name
      priority
      color
    }
  }
`;

const SHOT_TASKS = gql`
  ${TASK_FIELDS}
  query Tasks($id: ID!) {
    shot(id: $id) {
      id
      name
      type

      sequence {
        id
        name
      }

      tasks {
        ...TaskFieldsParam
      }
    }
  }
`;

const ASSET_TASKS = gql`
  ${TASK_FIELDS}
  query Tasks($id: ID!) {
    asset(id: $id) {
      id
      name
      type

      tasks {
        ...TaskFieldsParam
      }
    }
  }
`;

interface TaskViewProps {
  /** Entity for which we want to see the tasks */
  entity: Asset | Shot;

  /** Id of the entity that is selected */
  selectedTaskId: TaskId | undefined;

  /** Setter for the task id (managed by the parent component) */
  onTaskSelect: (newTask: Task) => void;
}

const TasksView = ({
  entity,
  selectedTaskId,
  onTaskSelect,
}: TaskViewProps): JSX.Element => {
  const query = useQuery<{ shot: Shot; asset: Asset }>(
    entity.type === "Shot" ? SHOT_TASKS : ASSET_TASKS,
    {
      variables: {
        id: entity.id,
      },
    }
  );

  return (
    <QueryWrapper
      query={query}
      render={(data) => {
        const entityFetch = data.asset || data.shot;

        return (
          <>
            {entityFetch.tasks.length > 0 ? (
              <List>
                {entityFetch.tasks
                  .slice() // Copy list since sort mutates
                  .sort((a, b) => a.taskType.priority - b.taskType.priority)
                  .map((task, i) => {
                    const isSelected = task.id === selectedTaskId;

                    let listItemProps: SxProps<Theme> = {
                      borderRadius: LIST_ITEM_BORDER_RADIUS,
                      py: 0.55,
                    };

                    if (isSelected) {
                      listItemProps = {
                        ...listItemProps,
                        backgroundColor: alpha(task.taskType.color, 0.2),
                        "&:hover": {
                          backgroundColor: alpha(task.taskType.color, 0.4),
                        },
                      };
                    }

                    return (
                      <Fade
                        key={task.id}
                        in
                        timeout={{ appear: 2000 * i, enter: 800 }}
                      >
                        <Paper
                          elevation={4}
                          sx={{
                            my: 1,
                            borderRadius: LIST_ITEM_BORDER_RADIUS,
                            boxShadow: isSelected
                              ? `inset 0 0 0 1.5px ${alpha(
                                  task.taskType.color,
                                  0.5
                                )}`
                              : "",
                          }}
                        >
                          <ListItem disablePadding>
                            <ListItemButton
                              sx={listItemProps}
                              onClick={() => onTaskSelect(task)}
                            >
                              {/* Task and subtask name */}
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "baseline",
                                  marginRight: "auto",
                                }}
                              >
                                <ListItemText
                                  primaryTypographyProps={{ fontSize: 15 }}
                                  primary={task.taskType.name}
                                />
                                <Typography
                                  color="text.disabled"
                                  fontSize={14}
                                  ml={1}
                                >
                                  {task.name}
                                </Typography>
                              </div>

                              {/* Colored circle of task type */}
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  alignItems: "center",
                                  width: "30px",
                                }}
                              >
                                <ColoredCircle
                                  size={17}
                                  color={task.taskType.color}
                                />
                              </div>
                            </ListItemButton>
                          </ListItem>
                        </Paper>
                      </Fade>
                    );
                  })}
              </List>
            ) : (
              <Typography color="text.disabled" fontSize={14}>
                No tasks... <br />
                Click on the + button to create one
              </Typography>
            )}
          </>
        );
      }}
    />
  );
};

export default TasksView;
