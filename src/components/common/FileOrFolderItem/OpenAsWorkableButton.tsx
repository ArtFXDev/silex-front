import ConstructionIcon from "@mui/icons-material/Construction";

import { uiSocket, useAuth } from "~/context";
import { COLORS } from "~/style/colors";

import LoadingChip from "../chips/LoadingChip";

interface OpenAsWorkableButtonProps {
  disabled?: boolean;
  taskId?: string;
  projectName?: string;
  projectPath?: string;
}

const OpenAsWorkableButton = ({
  disabled,
  taskId,
  projectName,
  projectPath,
}: OpenAsWorkableButtonProps): JSX.Element => {
  const { projects } = useAuth();

  return (
    <LoadingChip
      disabled={disabled}
      label="Workable"
      color={COLORS.silexGreen}
      icon={
        <ConstructionIcon
          sx={{ color: disabled ? "text.disabled" : COLORS.silexGreen }}
        />
      }
      clickNotification={{ message: "file tree loaded", variant: "success" }}
      onClick={(done) => {
        const lastProjectId = window.localStorage.getItem("last-project-id");

        const options: {
          action: string;
          projectName?: string;
          projectPath?: string;
          taskId?: string;
        } = {
          action: "pullWorkable",
        };

        if (projectName) {
          options.projectName = projectName;
        } else if (lastProjectId && projects) {
          const project = projects.find((p) => p.id === lastProjectId);
          if (project) options.projectName = project.name;
        }

        if (taskId) options.taskId = taskId;

        if (projectPath) options.projectPath = projectPath;

        uiSocket.emit("launchAction", options, () => done());
      }}
    />
  );
};

export default OpenAsWorkableButton;
