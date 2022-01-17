import StarIcon from "@mui/icons-material/Star";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import LazyMedia from "components/utils/LazyMedia/LazyMedia";
import { useAuth } from "context";
import { useHistory } from "react-router";
import { getColorFromString } from "utils/color";
import { formatUnderScoreStringWithSpaces } from "utils/string";
import { pictureThumbnailURL } from "utils/zou";

const ProjectsView = (): JSX.Element => {
  const auth = useAuth();
  const history = useHistory();

  const handleGoOnProject = (projectId: string) => {
    const defaultCategory =
      window.localStorage.getItem("explorer-default-category") || "shots";

    history.push(`/explorer/${projectId}/${defaultCategory}`);
    window.localStorage.setItem("last-project-id", projectId);
  };

  const lastProjectId = window.localStorage.getItem("last-project-id");

  return (
    <div>
      <Typography sx={{ mb: 2 }}>My projects:</Typography>

      {auth.projects && auth.projects.length > 0 ? (
        <Grid container spacing={1.5}>
          {auth.projects
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((project) => (
              <Grid key={project.id} item>
                <Card
                  sx={{ width: 120 }}
                  onClick={() => handleGoOnProject(project.id)}
                >
                  <CardActionArea>
                    <CardMedia
                      sx={{
                        position: "relative",
                        borderBottom: `3px solid ${getColorFromString(
                          project.name
                        )}`,
                      }}
                    >
                      <LazyMedia
                        src={
                          project.has_avatar
                            ? {
                                url: pictureThumbnailURL(
                                  "projects",
                                  project.id
                                ),
                                extension: "png",
                              }
                            : undefined
                        }
                        width={120}
                        height={120}
                        alt={project.name}
                        disableBorder
                      />

                      {project.id === lastProjectId && (
                        <StarIcon
                          fontSize="small"
                          sx={{ position: "absolute", top: 5, right: 5 }}
                        />
                      )}
                    </CardMedia>

                    <CardContent>
                      <Typography noWrap>
                        {formatUnderScoreStringWithSpaces(project.name)}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
        </Grid>
      ) : (
        <Typography color="text.disabled">
          You don{"'"}t have any projects...
        </Typography>
      )}
    </div>
  );
};

export default ProjectsView;
