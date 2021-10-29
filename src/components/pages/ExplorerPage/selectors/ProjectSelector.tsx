import AirIcon from "@mui/icons-material/Air";
import { Box, Fade, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import ColorHash from "color-hash";
import { useAuth } from "context/AuthContext";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { ProjectId } from "types/entities";
import { capitalize } from "utils/string";

const ProjectSelector = (): JSX.Element => {
  const [selectedProject, setSelectedProject] = useState<ProjectId>();

  const auth = useAuth();
  const history = useHistory();
  const location = useLocation();

  const colorhash = new ColorHash({ lightness: 0.7, saturation: 0.8 });

  // Get the current project from url
  useEffect(() => {
    const tokens = location.pathname.split("/");
    if (tokens.length >= 2) {
      setSelectedProject(tokens[2]);
    }
  }, [location.pathname]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    auth.setCurrentProjectId(event.target.value);

    setSelectedProject(event.target.value);
    window.localStorage.setItem("last-project-id", event.target.value);

    const sp = location.pathname.split("/");
    history.push(`/${sp[1]}/${event.target.value}/${sp[3]}`);
  };

  if (!auth.projects || auth.projects.length === 0 || !auth.getCurrentProject())
    return (
      <Select
        sx={{
          width: 230,
          height: 50,
          borderRadius: 3,
          paddingTop: 0,
          fontSize: 20,
        }}
        variant="outlined"
        value="Loading..."
      />
    );

  return (
    <Select
      sx={{
        width: 230,
        height: 50,
        borderRadius: 3,
        borderColor: colorhash.hex(
          auth.getCurrentProject()
            ? (auth.getCurrentProject()?.name as string)
            : ""
        ),
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
              <Fade in>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <AirIcon sx={{ color: colorhash.hex(project.name), mr: 1 }} />
                  {project.name
                    .split("_")
                    .map((s) => capitalize(s))
                    .join(" ")}
                </Box>
              </Fade>
            </MenuItem>
          ))}
    </Select>
  );
};

export default ProjectSelector;
