import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import SendIcon from "@mui/icons-material/Send";
import {
  CircularProgress,
  IconButton,
  ListItemIcon,
  Tooltip,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";

import { uiSocket } from "~/context";
import { FileExtension } from "~/types/files/extensions";

type ItemAction = {
  /** Returns true if the action is for that extension */
  pattern: (extension: FileExtension) => boolean | undefined;

  /** Title of the tooltip */
  title: string;

  /** Action on click, the done callback validate the execution */
  action: (done: () => void) => void;

  /** Icon to display */
  icon: JSX.Element;

  /** Optional icon when the action is finished */
  finishedIcon?: JSX.Element;

  /** Disable the action, when a feature is coming */
  disabled?: boolean;
};

interface ActionButtonProps {
  data: {
    path: string;
    name: string;
    extension: FileExtension;
  };
}

const ActionButton = ({ data }: ActionButtonProps): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  const { path, name, extension } = data;

  const actions: ItemAction[] = [
    {
      title: "pull in work",
      pattern: (extension: FileExtension) =>
        extension.tags && extension.tags.includes("sceneFile"),
      icon: <CloudDownloadIcon color="info" />,
      finishedIcon: <CloudDoneIcon color="success" />,

      action: (done) => {
        const tokens = path.replace("\\", "/").split("/");
        const indexOfPublish = tokens.indexOf("publish");
        const destination =
          tokens.slice(0, indexOfPublish).join("/") + `/work/${name}`;

        uiSocket.emit(
          "copyFile",
          {
            source: path,
            destination,
          },
          (response) => {
            if (response.status === 200) {
              enqueueSnackbar(`Copied publish file ${name} into work!`, {
                variant: "success",
              });
            } else {
              enqueueSnackbar(
                `Pull ${name} failed: ${JSON.stringify(response.msg)}`,
                {
                  variant: "error",
                }
              );
            }
            done();
          }
        );
      },
    },
    {
      title: "Submit to farm",
      disabled: true,
      pattern: (extension) =>
        extension.tags && extension.tags.includes("submit"),
      icon: <SendIcon /*sx={{ color: "#9575cd" }}*/ color="disabled" />,
      action: (done) => {
        uiSocket.emit("launchAction", { action: "submit" }, () => {
          done();
        });
      },
    },
  ];

  const action = actions.find((a) => a.pattern(extension));

  return (
    <>
      {action && (
        <ListItemIcon>
          <Tooltip
            title={action.disabled ? "Coming soon..." : action.title}
            placement="top"
            arrow
          >
            <IconButton
              onClick={() => {
                if (!loading && !finished) {
                  if (!action.disabled) {
                    setLoading(true);

                    action.action(() => {
                      setLoading(false);
                      setFinished(true);
                      setTimeout(() => setFinished(false), 3000);
                    });
                  }
                }
              }}
            >
              {loading ? (
                <CircularProgress size={22} color="info" />
              ) : finished ? (
                action.finishedIcon || <CheckCircleIcon color="success" />
              ) : (
                action.icon
              )}
            </IconButton>
          </Tooltip>
        </ListItemIcon>
      )}
    </>
  );
};

export default ActionButton;
