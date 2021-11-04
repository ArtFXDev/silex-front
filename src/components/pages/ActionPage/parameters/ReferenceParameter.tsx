import { gql, useQuery } from "@apollo/client";
import {
  Alert,
  Card,
  CardActions,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import SearchTextField from "components/common/SearchTextField/SearchTextField";
import LazyImage from "components/utils/LazyImage/LazyImage";
import QueryWrapper from "components/utils/QueryWrapper/QueryWrapper";
import { useAction } from "context";
import { useState } from "react";
import { Action } from "types/action/action";
import { Asset, Project, Shot } from "types/entities";
import { entityPreviewURL } from "utils/entity";
import { fuzzyMatch } from "utils/string";

const ASSETS_AND_SHOTS = gql`
  query GetAssetsAndShots($id: ID!) {
    project(id: $id) {
      assets {
        id
        name
        type
        preview_file_id
      }

      sequences {
        name
        id

        shots {
          id
          name
          type
          preview_file_id
        }
      }
    }
  }
`;

interface EntityCardProps {
  entity: Shot | Asset;
  name?: string;
  selectedId?: string;
  setSelected: (id: string) => void;
}

const EntityCard = ({
  entity,
  name,
  selectedId,
  setSelected,
}: EntityCardProps): JSX.Element => {
  const selected = selectedId === entity.id;

  return (
    <Card
      raised
      elevation={2}
      sx={{
        position: "relative",
        transition: "box-shadow 0.1s ease",
        ":hover": {
          boxShadow: !selected ? "0 0 0 2px rgba(200, 200, 200, 0.4)" : "",
        },
        boxShadow: selected ? "0 0 0 2px #62c673" : "",
        cursor: "pointer",
      }}
      onClick={() => setSelected(entity.id)}
    >
      <CardMedia sx={{ width: 90, height: 50 }}>
        <LazyImage
          src={entityPreviewURL(entity)}
          width={90}
          height={50}
          alt={entity.name}
          disableBorder
        />
      </CardMedia>

      <CardActions sx={{ py: 0, height: 20 }}>
        <Typography component="div" variant="caption">
          {name || entity.name}
        </Typography>
      </CardActions>
    </Card>
  );
};

const ReferenceParameter = (): JSX.Element => {
  const [search, setSearch] = useState<string>();
  const [selectedEntityId, setSelectedEntityId] = useState<string>();

  const actionContext = useAction();
  const action = actionContext.action as Action;

  const query = useQuery<{ project: Project }>(ASSETS_AND_SHOTS, {
    variables: { id: action.context_metadata.project_id },
  });
  const { data } = query;

  if (!action.context_metadata.project_id) {
    return (
      <Alert variant="outlined" color="warning">
        You didn{"'"}t run this action in a proper context. The project_id is
        missing...
      </Alert>
    );
  }

  return (
    <div>
      <SearchTextField
        variant="outlined"
        placeholder="Search..."
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mr: 3, mb: 3 }}
      />

      <QueryWrapper query={query}>
        {data && (
          <Grid
            container
            spacing={1.5}
            sx={{ maxHeight: 300, overflow: "scroll", overflowX: "hidden" }}
          >
            {data.project.sequences.map((sq) =>
              sq.shots
                .filter((sh) =>
                  search
                    ? fuzzyMatch(sh.name, search) || fuzzyMatch(sq.name, search)
                    : true
                )
                .map((sh) => (
                  <Grid item key={sh.id}>
                    <EntityCard
                      entity={sh}
                      name={`${sq.name} - ${sh.name}`}
                      selectedId={selectedEntityId}
                      setSelected={setSelectedEntityId}
                    />
                  </Grid>
                ))
            )}

            {data.project.assets
              .filter((a) => (search ? fuzzyMatch(a.name, search) : true))
              .map((asset) => (
                <Grid item key={asset.id}>
                  <EntityCard
                    entity={asset}
                    selectedId={selectedEntityId}
                    setSelected={setSelectedEntityId}
                  />
                </Grid>
              ))}
          </Grid>
        )}
      </QueryWrapper>
    </div>
  );
};

export default ReferenceParameter;
