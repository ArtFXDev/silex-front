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

        entity_type {
          id
          name
        }

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
  selectedEntityId: string | undefined;

  /** Called when clicking on an entity */
  onEntitySelect: (entity: Shot | Asset) => void;
}

const AssetsAndShotsView = ({
  projectId,
  search,
  onEntitySelect,
  selectedEntityId,
}: AssetsAndShotsViewProps): JSX.Element => {
  const query = useQuery<{ project: Project }>(ASSETS_AND_SHOTS, {
    variables: {
      id: projectId,
    },
  });
  const { data } = query;

  return (
    <QueryWrapper
      query={query}
      render={(data) => (
        <Grid
          container
          spacing={1.5}
          sx={{ maxHeight: 340, pb: 2, overflowY: "auto" }}
        >
          {data.project.sequences.map((sq) =>
            sq.shots
              .slice()
              .sort((a, b) => a.name.localeCompare(b.name))
              .filter((sh) => fuzzyMatch([sh.name, sq.name], search))
              .map((shot) => (
                <Grid item key={shot.id} onClick={() => onEntitySelect(shot)}>
                  <EntityCard
                    entity={shot}
                    name={`${sq.name} - ${shot.name}`}
                    selected={
                      selectedEntityId ? shot.id === selectedEntityId : false
                    }
                  />
                </Grid>
              ))
          )}

          {data.project.assets
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .filter((a) =>
              search ? fuzzyMatch([a.name, a.entity_type.name], search) : true
            )
            .map((asset) => (
              <Grid item key={asset.id} onClick={() => onEntitySelect(asset)}>
                <EntityCard
                  entity={asset}
                  selected={
                    selectedEntityId ? asset.id === selectedEntityId : false
                  }
                />
              </Grid>
            ))}
        </Grid>
      )}
    />
  );
};

export default AssetsAndShotsView;
