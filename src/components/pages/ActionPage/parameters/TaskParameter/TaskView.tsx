import { gql, useQuery } from "@apollo/client";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import {
  Fade,
  IconButton,
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
import ColoredCircle from "components/common/ColoredCircle/ColoredCircle";
import QueryWrapper from "components/utils/QueryWrapper/QueryWrapper";
import { LIST_ITEM_BORDER_RADIUS } from "style/constants";
import { Asset, Shot, TaskId } from "types/entities";

const TASK_FIELDS = gql`
  fragment TaskFields on Task {
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

      sequence {
        id
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
  query Tasks($id: ID!) {
    asset(id: $id) {
      id
      name

      tasks {
        ...TaskFields
      }
    }
  }
`;

interface TaskViewProps {
  /** Entity for which we want to see the tasks */
  entity: { id: string; forShots: boolean };

  /** Id of the entity that is selected */
  selectedTaskId: TaskId | null;

  /** Setter for the task id (managed by the parent component) */
  setSelectedTaskId: (newId: TaskId) => void;

  onExit: () => void;
}

const TasksView = ({
  entity,
  selectedTaskId,
  onExit,
  setSelectedTaskId,
}: TaskViewProps): JSX.Element => {
  const query = useQuery<{ shot?: Shot; asset?: Asset }>(
    entity.forShots ? SHOT_TASKS : ASSET_TASKS,
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
        <>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* Sequence and shot name */}
            <Typography>
              {entityFetch.type === "Shot"
                ? `${entityFetch.sequence.name} - ${entityFetch.name}`
                : entityFetch.name}
            </Typography>

            {/* Go back button */}
            <IconButton sx={{ ml: "auto" }} onClick={onExit}>
              <KeyboardReturnIcon />
            </IconButton>
          </div>

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
                      outline: `1px solid ${task.taskType.color}`,
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
                        sx={{ my: 1, borderRadius: LIST_ITEM_BORDER_RADIUS }}
                      >
                        <ListItem disablePadding>
                          <ListItemButton
                            sx={listItemProps}
                            onClick={() => setSelectedTaskId(task.id)}
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
      )}
    </QueryWrapper>
  );
};

export default TasksView;
