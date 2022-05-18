import AirIcon from "@mui/icons-material/Air";
import { Fade, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useAuth } from "context/AuthContext";
import { ProjectId } from "types/entities";
import { getColorFromString } from "utils/color";
import { formatUnderScoreStringWithSpaces } from "utils/string";

interface ProjectSelectorProps {
  value: ProjectId | undefined;
  onChange: (e: SelectChangeEvent<string>) => void;
  disabled?: boolean;
  small?: boolean;
}

const ProjectSelector = ({
  value,
  onChange,
  disabled,
  small,
}: ProjectSelectorProps): JSX.Element => {
  const auth = useAuth();

  return (
    <Select
      sx={{
        minWidth: small ? "auto" : 230,
        height: small ? 40 : 50,
        borderRadius: 3,
        paddingTop: 0,
        fontSize: small ? 16 : 20,
      }}
      variant="outlined"
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
      color="info"
    >
      {auth.projects &&
        auth.projects
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((project) => {
            const projectColor = project.color
              ? project.color
              : getColorFromString(project.name);

            return (
              <MenuItem
                key={project.id}
                value={project.id}
                sx={{ color: projectColor }}
              >
                <Fade in>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <AirIcon
                      sx={{ color: projectColor, mr: 1 }}
                      fontSize={small ? "small" : "medium"}
                    />
                    {formatUnderScoreStringWithSpaces(project.name)}
                  </div>
                </Fade>
              </MenuItem>
            );
          })}
    </Select>
  );
};

export default ProjectSelector;
