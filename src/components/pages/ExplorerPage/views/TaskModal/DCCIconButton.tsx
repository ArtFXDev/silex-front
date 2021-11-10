import AddIcon from "@mui/icons-material/Add";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import {
  CircularProgress,
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
import { Project } from "types/entities";

interface DCCIconButtonProps {
  taskId: string;
  dcc: string;
}

const DCCIconButton = ({ dcc, taskId }: DCCIconButtonProps): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { uiSocket } = useSocket();
  const { enqueueSnackbar } = useSnackbar();
  const { getCurrentProject } = useAuth();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onCreateNewScene = (dcc: string) => {
    uiSocket.emit(
      "launchScene",
      { taskId, dcc, projectName: (getCurrentProject() as Project).name },
      (response) => {
        enqueueSnackbar(`Creating new scene with ${dcc} (${response.msg})`, {
          variant: "info",
        });
      }
    );
  };

  const onConform = () => {
    uiSocket.emit(
      "launchAction",
      {
        action: "conform",
        taskId,
        projectName: (getCurrentProject() as Project).name,
      },
      (response) => {
        enqueueSnackbar(`Launched conform action ${response.msg}`, {
          variant: "info",
        });
      }
    );
  };

  return (
    <>
      <Tooltip title={dcc} arrow placement="top">
        <IconButton key={dcc} onClick={handleClick} sx={{ mx: 0.5 }}>
          <DCCLogo name={dcc} size={30} />
          {loading && (
            <CircularProgress
              size={15}
              color="info"
              sx={{ position: "absolute", top: 0, right: 0 }}
            />
          )}
        </IconButton>
      </Tooltip>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            if (!loading) {
              setLoading(true);
              onCreateNewScene(dcc);
              uiSocket.once("dccConnect", () => setLoading(false));
            }
            handleClose();
          }}
        >
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          New scene
        </MenuItem>

        <MenuItem
          onClick={() => {
            onConform();
            handleClose();
          }}
        >
          <ListItemIcon>
            <FileUploadIcon />
          </ListItemIcon>
          Conform
        </MenuItem>
      </Menu>
    </>
  );
};

export default DCCIconButton;
