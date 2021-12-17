import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LaunchIcon from "@mui/icons-material/Launch";
import {
  CircularProgress,
  Fade,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import DCCLogo from "components/common/DCCLogo/DCCLogo";
import { useAuth, useSocket } from "context";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { Project } from "types/entities";

interface DCCIconButtonProps {
  taskId: string;
  dcc: string;
  disabled?: boolean;
}

const DCCIconButton = ({
  dcc,
  taskId,
  disabled,
}: DCCIconButtonProps): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [launchSceneSuccess, setLaunchSceneSuccess] = useState<boolean>(false);

  const projectId = useRouteMatch<{ projectId: string }>().params.projectId;
  const { uiSocket } = useSocket();
  const { enqueueSnackbar } = useSnackbar();
  const { projects } = useAuth();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onCreateNewScene = (dcc: string | undefined) => {
    if (projects === undefined) return;

    const projectName = (projects.find((p) => p.id === projectId) as Project)
      .name;

    if (projectName) {
      uiSocket.emit("launchScene", { taskId, dcc, projectName }, (response) => {
        enqueueSnackbar(`Opening a new scene with ${dcc} (${response.msg})`, {
          variant: "info",
        });
      });
    }
  };

  const menuActions = [
    {
      label: "Open",
      icon: <LaunchIcon />,
      onClick: () => {
        if (!loading && !launchSceneSuccess) {
          setLoading(true);
          onCreateNewScene(dcc);

          uiSocket.once("dccConnect", () => {
            setLoading(false);
            setLaunchSceneSuccess(true);
            setTimeout(() => setLaunchSceneSuccess(false), 8000);
          });
        }
        handleClose();
      },
      standalone: false,
    },
  ];

  return (
    <>
      <Tooltip title={disabled ? `coming soon...` : dcc} arrow placement="top">
        <span>
          <IconButton
            onClick={handleClick}
            sx={{ mx: 0.5 }}
            disabled={disabled}
          >
            <DCCLogo name={dcc} size={30} disabled={disabled} />

            <Fade in={loading}>
              <CircularProgress
                size={15}
                color="info"
                sx={{ position: "absolute", top: 0, right: 0 }}
              />
            </Fade>

            <Fade in={launchSceneSuccess}>
              <CheckCircleIcon
                fontSize="small"
                color="success"
                sx={{ position: "absolute", top: 0, right: 0 }}
              />
            </Fade>
          </IconButton>
        </span>
      </Tooltip>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {menuActions
          .filter((a) => (dcc === "standalone" ? a.standalone : !a.standalone))
          .map((menuAction, i) => (
            <MenuItem key={i} onClick={menuAction.onClick}>
              <ListItemIcon>{menuAction.icon}</ListItemIcon>
              {menuAction.label}
            </MenuItem>
          ))}
      </Menu>
    </>
  );
};

export default DCCIconButton;
