import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { gql, useQuery } from "@apollo/client";
import { Task } from "types";
import QueryWrapper from "components/QueryWrapper/QueryWrapper";
import LazyImage from "components/LazyImage/LazyImage";

const TASK = gql`
  query getTask($id: ID!) {
    task(id: $id) {
      id
      name
      taskType {
        name
      }
    }
  }
`;

interface TaskModalProps {
  taskId: string;
  onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ taskId, onClose }) => {
  const query = useQuery<{ task: Task }>(TASK, {
    variables: { id: taskId },
  });
  const { data } = query;

  return (
    <Dialog open onClose={onClose} fullWidth>
      <QueryWrapper query={query}>
        {data && (
          <>
            <DialogTitle>
              {data.task.taskType.name}
              <IconButton
                sx={{ position: "absolute", top: 0, right: 0, m: 1 }}
                onClick={onClose}
              >
                <CloseIcon color="disabled" />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers>
              <Grid container sx={{ p: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">
                    {data.task.description}
                  </Typography>
                </Grid>

                <Grid xs={6}>
                  <LazyImage
                    width={180}
                    height={100}
                    alt="task image"
                    disableFade
                  />
                </Grid>
              </Grid>
            </DialogContent>
          </>
        )}
      </QueryWrapper>
    </Dialog>
  );
};

export default TaskModal;
