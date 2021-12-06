import { LinearProgress } from "@mui/material";
import { Shot } from "types/entities";

interface ShotProgressBarProps {
  shot: Shot;
}

const ShotProgressBar = ({ shot }: ShotProgressBarProps): JSX.Element => {
  const nDone = shot.tasks
    .map((task) => task.taskStatus.is_done)
    .filter((d) => d).length;
  const progressPercent = (nDone / shot.tasks.length) * 100;

  return (
    <LinearProgress
      variant="determinate"
      color="success"
      sx={{ width: 100, height: 8, borderRadius: 5 }}
      value={progressPercent}
    />
  );
};

export default ShotProgressBar;
