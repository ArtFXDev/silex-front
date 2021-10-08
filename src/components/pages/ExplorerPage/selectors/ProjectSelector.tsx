import { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import ColorHash from "color-hash";
import AirIcon from "@mui/icons-material/Air";

import { useAuth } from "context/AuthContext";
import { ProjectId } from "types";

const ProjectSelector = (): JSX.Element => {
  const [selectedProject, setSelectedProject] = useState<ProjectId>();

  const auth = useAuth();
  const history = useHistory();
  const location = useLocation();

  const colorhash = new ColorHash({ lightness: 0.7, saturation: 0.8 });

  const handleChange = (event: SelectChangeEvent<string>) => {
    auth.setCurrentProjectId(event.target.value);
    setSelectedProject(event.target.value);

    const sp = location.pathname.split("/");
    history.push(`/${sp[1]}/${event.target.value}/${sp[3]}`);
  };

  if (!auth.projects || auth.projects.length === 0)
    return (
      <Typography variant="caption" color="text.disabled" sx={{ mr: 4 }}>
        No projects...
      </Typography>
    );

  return (
    <Select
      sx={{
        width: 230,
        height: 50,
        borderRadius: 3,
        borderColor: colorhash.hex(auth.getCurrentProject()?.name as string),
        paddingTop: 0,
        fontSize: 20,
      }}
      variant="outlined"
      value={selectedProject || auth.currentProjectId}
      onChange={handleChange}
    >
      {auth.projects &&
        auth.projects
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((project) => (
            <MenuItem
              key={project.id}
              value={project.id}
              sx={{
                color: colorhash.hex(project.name),
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <AirIcon sx={{ color: colorhash.hex(project.name), mr: 1 }} />
                {project.name[0] + project.name.slice(1).toLowerCase()}
              </Box>
            </MenuItem>
          ))}
    </Select>
  );
};

export default ProjectSelector;
