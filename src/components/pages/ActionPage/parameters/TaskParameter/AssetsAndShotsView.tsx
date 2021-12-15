import { gql, useQuery } from "@apollo/client";
import { Grid } from "@mui/material";
import QueryWrapper from "components/utils/QueryWrapper/QueryWrapper";
import { Asset, Project, Shot } from "types/entities";
import { fuzzyMatch } from "utils/string";

import EntityCard from "./EntityCard";

const TASK_FIELDS = gql`
  fragment TaskFields on Task {
    id
    type

    taskType {
      id
      name
      priority
    }
  }
`;

const ASSETS_AND_SHOTS = gql`
  ${TASK_FIELDS}
  query AssetsAndShots($id: ID!) {
    project(id: $id) {
      id

      assets {
        id
        name
        type
        preview_file_id

        tasks {
          ...TaskFields
        }
      }

      sequences {
        id
        name

        shots {
          id
          name
          type
          preview_file_id

          sequence {
            id
            name
          }

          tasks {
            ...TaskFields
          }
        }
      }
    }
  }
`;

interface AssetsAndShotsViewProps {
  projectId: string;

  /** Search input */
  search: string | undefined;

  /** The previous selected entity is highlighted */
  selectedEntity: Shot | Asset | undefined;

  /** Called when clicking on an entity */
  onEntityClick: (entity: Shot | Asset) => void;
}

const AssetsAndShotsView = ({
  projectId,
  search,
  onEntityClick,
  selectedEntity,
}: AssetsAndShotsViewProps): JSX.Element => {
  const query = useQuery<{ project: Project }>(ASSETS_AND_SHOTS, {
    variables: {
      id: projectId,
    },
  });
  const { data } = query;

  return (
    <QueryWrapper query={query}>
      {data && (
        <Grid
          container
          spacing={1.5}
          sx={{ maxHeight: 320, overflow: "scroll", overflowX: "hidden" }}
        >
          {data.project.sequences.map((sq) =>
            sq.shots
              .filter((sh) =>
                search
                  ? fuzzyMatch(sh.name, search) || fuzzyMatch(sq.name, search)
                  : true
              )
              .map((shot) => (
                <Grid item key={shot.id} onClick={() => onEntityClick(shot)}>
                  <EntityCard
                    entity={shot}
                    name={`${sq.name} - ${shot.name}`}
                    selected={selectedEntity && shot.id === selectedEntity.id}
                  />
                </Grid>
              ))
          )}

          {data.project.assets
            .filter((a) => (search ? fuzzyMatch(a.name, search) : true))
            .map((asset) => (
              <Grid item key={asset.id} onClick={() => onEntityClick(asset)}>
                <EntityCard
                  entity={asset}
                  selected={selectedEntity && asset.id === selectedEntity.id}
                />
              </Grid>
            ))}
        </Grid>
      )}
    </QueryWrapper>
  );
};

export default AssetsAndShotsView;
