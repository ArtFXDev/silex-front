import { useEffect, useState } from "react";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

import { useSocket } from "context";
import {
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";
import DCCLogo from "components/DCCLogo/DCCLogo";

const extensionToDCCName = (ext: string): string => {
  switch (ext) {
    case "ma":
    case "mb":
      return "maya";
    case "blend":
      return "blender";
    case "nk":
      return "nuke";
    case "hip":
      return "houdini";
    default:
      return "";
  }
};

const SceneList = (): JSX.Element => {
  const [scenes, setScenes] = useState<string[]>();
  const { socket } = useSocket();

  const path = "/home/josephhenry/Desktop/pipeline";

  useEffect(() => {
    socket.emit("ls", path, (paths) => {
      setScenes(paths.data);
    });
  }, [socket]);

  const openDCC = (dcc: string, scene: string) => {
    const cmd = `rez env silex_client ${dcc} -- ${dcc} ${path}/${scene}`;
    socket.emit("exec", cmd, (response) => {
      console.log(response);
    });
  };

  return (
    <List>
      {scenes &&
        scenes.map((scene) => {
          const dcc = extensionToDCCName(scene.split(".")[1]);

          return (
            <Paper key={scene} sx={{ my: 1 }}>
              <ListItem>
                <DCCLogo name={dcc} size={30} sx={{ mr: 2 }} />

                <ListItemText>{scene}</ListItemText>

                <ListItemIcon>
                  <IconButton onClick={() => openDCC(dcc, scene)}>
                    <PlayCircleOutlineIcon />
                  </IconButton>
                </ListItemIcon>
              </ListItem>
            </Paper>
          );
        })}
    </List>
  );
};

export default SceneList;
