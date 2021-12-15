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
                  onClick={() => history.push(`/explorer/${project.id}/shots`)}
                >
                  <CardActionArea>
                    <CardMedia
                      sx={{
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
