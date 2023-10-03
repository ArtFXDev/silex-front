import SendIcon from "@mui/icons-material/Send";

import { uiSocket, useAuth } from "~/context";
import { COLORS } from "~/style/colors";

import LoadingChip from "./LoadingChip";

interface SubmitButtonProps {
  disabled?: boolean;
  taskId?: string;
  projectName?: string;
}

const SubmitButton = ({
  disabled,
  taskId,
  projectName,
}: SubmitButtonProps): JSX.Element => {
  const { projects } = useAuth();

  return (
    <LoadingChip
      disabled={disabled}
      label="Submit"
      color={COLORS.submit}
      icon={
        <SendIcon sx={{ color: disabled ? "text.disabled" : COLORS.submit }} />
      }
      clickNotification={{ message: "Launched submit", variant: "success" }}
      onClick={(done) => {
        const lastProjectId = window.localStorage.getItem("last-project-id");

        const options: {
          action: string;
          projectName?: string;
          taskId?: string;
        } = {
          action: "submit",
        };

        if (projectName) {
          options.projectName = projectName;
        } else if (lastProjectId && projects) {
          const project = projects.find((p) => p.id === lastProjectId);
          if (project) options.projectName = project.name;
        }

        if (taskId) options.taskId = taskId;

        uiSocket.emit("launchAction", options, () => done());
      }}
    />
  );
};

export default SubmitButton;
