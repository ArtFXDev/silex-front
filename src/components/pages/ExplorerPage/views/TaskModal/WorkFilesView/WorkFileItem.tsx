import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LaunchIcon from "@mui/icons-material/Launch";
import {
  CircularProgress,
  Fade,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import FileIcon from "components/common/FileIcon/FileIcon";
import { uiSocket, useAuth } from "context";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { LIST_ITEM_BORDER_RADIUS } from "style/constants";
import { Project } from "types/entities";
import { extensions } from "types/files/extensions";
import { FileOrFolder } from "types/socket";
import { formatDateTime } from "utils/date";
import { getFileExtension } from "utils/files";

interface WorkFileItemProps {
  file: FileOrFolder;
  moreDetails: boolean;
}

const WorkFileItem = ({
  file,
  moreDetails,
}: WorkFileItemProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [launchSuccess, setLaunchSuccess] = useState<boolean>(false);

  const { enqueueSnackbar } = useSnackbar();
  const { getCurrentProject } = useAuth();
  const { taskId } = useRouteMatch<{ taskId: string }>().params;

  const extensionName = getFileExtension(file.name);
  const extension = extensionName ? extensions[extensionName] : undefined;

  const openScene = (dcc: string, scene: string) => {
    setIsLoading(true);

    uiSocket.emit(
      "launchScene",
      {
        taskId,
        scene,
        dcc,
        projectName: (getCurrentProject() as Project).name,
      },
      (response) => {
        enqueueSnackbar(`Launching dcc ${dcc} (${response.msg})`, {
          variant: "info",
        });
      }
    );

    uiSocket.once("dccConnect", (response) => {
      if (response.data.context.dcc === dcc) {
        setIsLoading(false);
        setLaunchSuccess(true);
        setTimeout(() => setLaunchSuccess(false), 8000);
      }
    });
  };

  return (
    <Paper elevation={1} sx={{ my: 1, borderRadius: LIST_ITEM_BORDER_RADIUS }}>
      <ListItemButton
        sx={{
          borderRadius: LIST_ITEM_BORDER_RADIUS,
          color: "text.secondary",
        }}
      >
        <ListItemIcon>
          <FileIcon name={extension?.software} size={30} sx={{ mr: 2 }} />
        </ListItemIcon>

        <ListItemText
          primaryTypographyProps={{
            fontSize: 14,
          }}
          secondaryTypographyProps={{
            color: "text.disabled",
          }}
        >
          {file.name}
        </ListItemText>

        {moreDetails && (
          <Typography color="text.disabled" fontSize={13} mr={1}>
            Last modif: {formatDateTime(file.mtime)}
          </Typography>
        )}

        {extension && (
          <ListItemIcon>
            <Tooltip
              title={
                isLoading
                  ? "Opening..."
                  : launchSuccess
                  ? "Launched!"
                  : "Open scene"
              }
              placement="left"
            >
              <IconButton
                onClick={() =>
                  openScene(extension.software as string, file.path)
                }
                disabled={isLoading || launchSuccess}
              >
                {isLoading && (
                  <Fade in>
                    <CircularProgress size={22} color="info" />
                  </Fade>
                )}

                {launchSuccess && (
                  <Fade in>
                    <CheckCircleIcon color="success" />
                  </Fade>
                )}

                {!isLoading && !launchSuccess && (
                  <Fade in>
                    <LaunchIcon
                      color="disabled"
                      sx={{
                        transition: "all 0.2s ease",
                        "&:hover": { color: "white" },
                      }}
                    />
                  </Fade>
                )}
              </IconButton>
            </Tooltip>
          </ListItemIcon>
        )}
      </ListItemButton>
    </Paper>
  );
};

export default WorkFileItem;
