import { gql, useQuery } from "@apollo/client";
import { Grid } from "@mui/material";
import QueryWrapper from "components/utils/QueryWrapper/QueryWrapper";
import { Action } from "types/action/action";
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
        name
        id

        shots {
          id
          name
          type
          preview_file_id

          sequence {
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
  /** Search input */
  search: string | undefined;

  /** The current action */
  action: Action;

  /** The previous selected entity is highlighted */
  selectedEntity: Shot | Asset | undefined;

  /** Called when clicking on an entity */
  onEntityClick: (entity: Shot | Asset) => void;
}

const AssetsAndShotsView = ({
  search,
  action,
  onEntityClick,
  selectedEntity,
}: AssetsAndShotsViewProps): JSX.Element => {
  const query = useQuery<{ project: Project }>(ASSETS_AND_SHOTS, {
    variables: {
      id: action.context_metadata.project_id,
    },
  });
  const { data } = query;

  return (
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
