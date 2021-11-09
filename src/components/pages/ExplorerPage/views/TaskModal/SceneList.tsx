import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import {
  Alert,
  Box,
  Fade,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import DCCLogo from "components/common/DCCLogo/DCCLogo";
import { useAuth, useSocket } from "context";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Project } from "types/entities";

import DCCIconButton from "./DCCIconButton";

const extensionToDCCName = (ext: string): string | null => {
  switch (ext) {
    case "ma":
    case "mb":
      return "maya";
    case "blend":
      return "blender";
    case "nk":
      return "nuke";
    case "hip":
    case "hipnc":
      return "houdini";
    default:
      return null;
  }
};

interface SceneListProps {
  taskId: string;
}

const SceneList = ({ taskId }: SceneListProps): JSX.Element => {
  const [path, setPath] = useState<string>();
  const [scenes, setScenes] = useState<string[]>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);

  const { uiSocket } = useSocket();
  const { enqueueSnackbar } = useSnackbar();
  const { getCurrentProject } = useAuth();

  useEffect(() => {
    uiSocket.emit("getWorkingFilesForTask", { taskId }, (response) => {
      if (response.data) {
        setPath(response.data.path);
        setScenes(response.data.files);
      } else {
        setError(response.msg);
      }

      setLoading(false);
    });
  }, [uiSocket, taskId]);

  const openScene = (dcc: string, scene: string) => {
    uiSocket.emit(
      "launchScene",
      {
        taskId,
        scene,
        dcc,
        path: path as string,
        projectName: (getCurrentProject() as Project).name,
      },
      (response) => {
        enqueueSnackbar(`Launching dcc ${dcc} (${response.msg})`, {
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Typography variant="h6">Working scenes:</Typography>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box sx={{ mr: 3 }}>
            {["blender", "houdini", "nuke", "maya"].map((dcc) => (
              <DCCIconButton key={dcc} taskId={taskId} dcc={dcc} />
            ))}
          </Box>

          {/* <Button onClick={() => onConform()}>Conform</Button> */}
        </div>
      </Box>

      <Box sx={{ borderRadius: 3, p: 1 }}>
        {loading ? (
          <LinearProgress />
        ) : (
          <List>
            {scenes &&
              scenes.map((scene, i) => {
                const tokens = scene.split(".");
                const dcc = extensionToDCCName(tokens[tokens.length - 1]);

                return (
                  <Fade in timeout={i * 200} key={scene}>
                    <Paper sx={{ my: 1 }} elevation={6}>
                      <ListItem>
                        <DCCLogo name={dcc} size={30} sx={{ mr: 2 }} />

                        <ListItemText
                          primaryTypographyProps={{
                            fontSize: 14,
                          }}
                        >
                          {scene}
                        </ListItemText>

                        {dcc && (
                          <ListItemIcon>
                            <Tooltip title="Open scene" placement="left">
                              <IconButton onClick={() => openScene(dcc, scene)}>
                                <PlayCircleOutlineIcon />
                              </IconButton>
                            </Tooltip>
                          </ListItemIcon>
                        )}
                      </ListItem>
                    </Paper>
                  </Fade>
                );
              })}
          </List>
        )}

        {(error || (scenes && scenes.length === 0)) && (
          <Alert variant="outlined" severity="info">
            You don{"'"}t have any working scenes...
          </Alert>
        )}
      </Box>
    </>
  );
};

export default SceneList;
