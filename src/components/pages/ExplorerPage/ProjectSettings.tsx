import VideoSettingsIcon from "@mui/icons-material/VideoSettings";
import {
  IconButton,
  Menu,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useAuth } from "context";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { ProjectId } from "types/entities";
import { debounce } from "utils/action";
import { updateProject } from "utils/zou";

interface Props {
  project?: ProjectId;
}
const ProjectSettings = ({ project }: Props): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const auth = useAuth();

  const currentProject = auth.getCurrentProject();
  const currentProjectColor = currentProject
    ? currentProject.color || "#1aab7a"
    : "#1aab7a";

  const handleActionMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    // Stop propagation of onClick event because buttons are overlaping
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleActionMenuClose = () => {
    setAnchorEl(null);
  };

  const setProjectColor = debounce(async (color: string) => {
    if (!project) {
      return;
    }
    await updateProject(project, { color: color });
    await auth.updateProjects();
  }, 500);

  const setProjectName = debounce(async (name: string) => {
    if (!project) {
      return;
    }
    await updateProject(project, { name: name });
    await auth.updateProjects();
  }, 500);

  return (
    <div>
      <Tooltip title={`Project settings`} placement="top" arrow>
        <IconButton sx={{ ml: 0.5 }} onClick={handleActionMenuClick}>
          <VideoSettingsIcon color="disabled" />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleActionMenuClose}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            margin: 15,
          }}
        >
          <Typography
            fontSize={20}
            style={{ marginBottom: 5, textAlign: "center" }}
          >
            Project settings
          </Typography>

          <div style={{ marginBottom: 10 }}>
            <Typography fontSize={14} style={{ marginBottom: 5 }}>
              Name
            </Typography>

            <TextField
              size="small"
              variant="outlined"
              placeholder="Project name"
              value={currentProject ? currentProject.name : null}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>

          <div>
            <Typography fontSize={14} style={{ marginBottom: 5 }}>
              Color
            </Typography>
            <HexColorPicker
              color={currentProjectColor}
              onChange={setProjectColor}
              style={{ marginLeft: "auto", marginRight: "auto" }}
            />
          </div>
        </div>
      </Menu>
    </div>
  );
};

export default ProjectSettings;
