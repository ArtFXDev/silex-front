import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import {
  Alert,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  SpeedDial,
  SpeedDialAction,
  Typography,
} from "@mui/material";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import DCCLogo from "components/common/DCCLogo/DCCLogo";
import { useSocket } from "context";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";

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

  const { enqueueSnackbar } = useSnackbar();
  const { uiSocket } = useSocket();

  useEffect(() => {
    uiSocket.emit("getWorkingFilesForTask", { taskId }, (response) => {
      if (response.data) {
        setPath(response.data.path);
        setScenes(response.data.files);
      } else {
        setError(response.msg);
      }
    });
  }, [uiSocket, taskId]);

  const openScene = (dcc: string, scene: string) => {
    uiSocket.emit(
      "launchScene",
      { taskId, scene, dcc, path: path as string },
      (response) => {
        enqueueSnackbar(`Launching dcc ${dcc} (${response.msg})`, {
          variant: "info",
        });
      }
    );
  };

  const onCreateNewScene = (dcc: string) => {
    uiSocket.emit("launchScene", { taskId, dcc }, (response) => {
      enqueueSnackbar(`Creating new scene with ${dcc} (${response.msg})`, {
        variant: "info",
      });
    });
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
        }}
      >
        <div>
          <Typography variant="h6">Working scenes:</Typography>
          {/* {path && (
            <Typography variant="subtitle2" color="text.disabled">
              {path}
            </Typography>
          )} */}
        </div>

        <SpeedDial
          icon={<SpeedDialIcon />}
          ariaLabel="open dcc"
          sx={{ position: "absolute", right: 0, bottom: 0 }}
          FabProps={{ size: "small" }}
          direction="left"
        >
          {["blender", "houdini", "nuke", "maya"].map((dcc) => (
            <SpeedDialAction
              key={dcc}
              icon={<DCCLogo name={dcc} size={30} />}
              tooltipTitle={dcc}
              onClick={() => onCreateNewScene(dcc)}
            />
          ))}
        </SpeedDial>
      </Box>

      <Box sx={{ overflow: "auto", maxHeight: 250, borderRadius: 3, p: 1 }}>
        <List>
          {scenes &&
            scenes.map((scene) => {
              const tokens = scene.split(".");
              const dcc = extensionToDCCName(tokens[tokens.length - 1]);

              return (
                <Paper key={scene} sx={{ my: 1 }} elevation={6}>
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
                        <IconButton onClick={() => openScene(dcc, scene)}>
                          <PlayCircleOutlineIcon />
                        </IconButton>
                      </ListItemIcon>
                    )}
                  </ListItem>
                </Paper>
              );
            })}
        </List>

        {error && (
          <Alert variant="outlined" severity="info">
            You don{"'"}t have any working scenes...
          </Alert>
        )}
      </Box>
    </div>
  );
};

export default SceneList;
