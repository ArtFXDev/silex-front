import { useState } from "react";
import { MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";

import { useAuth } from "context/AuthContext";
import { ProjectId } from "types";

const ProjectSelector: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectId | null>(
    null
  );
  const auth = useAuth();

  const handleChange = (event: SelectChangeEvent<string>) => {
    auth.setCurrentProject(event.target.value);
    setSelectedProject(event.target.value);
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
        height: 30,
        mr: 4,
        backgroundColor: "primary.main",
        borderRadius: 10,
        paddingTop: 0,
        typography: "caption",
      }}
      variant="outlined"
      value={selectedProject || (auth.projects ? auth.projects[0].id : "")}
      onChange={handleChange}
    >
      {auth.projects &&
        auth.projects.map((project) => (
          <MenuItem key={project.id} value={project.id}>
            {project.name[0] + project.name.slice(1).toLowerCase()}
          </MenuItem>
        ))}
    </Select>
  );
};

export default ProjectSelector;
