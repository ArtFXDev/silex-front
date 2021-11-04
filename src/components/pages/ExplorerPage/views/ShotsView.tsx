import { gql, useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import QueryWrapper from "components/utils/QueryWrapper/QueryWrapper";
import { useRouteMatch } from "react-router";
import { Project } from "types/entities";
import { fuzzyMatch } from "utils/string";

import EntitiesView from "./EntitiesView";

const SEQUENCES_AND_SHOTS = gql`
  query GetSequencesAndShots($id: ID!) {
    project(id: $id) {
      id

      sequences {
        name
        id

        shots {
          id
          name
          type
          preview_file_id

          tasks {
            taskStatus {
              is_done
            }
          }
        }
      }
    }
  }
`;

interface ShotsViewProps {
  listView: boolean;
  search: string;
}

const ShotsView = ({ listView, search }: ShotsViewProps): JSX.Element => {
  const routeMatch = useRouteMatch<{ projectId: string }>();

  const query = useQuery<{ project: Project }>(SEQUENCES_AND_SHOTS, {
    variables: { id: routeMatch.params.projectId },
  });
  const { data } = query;

  return (
    <QueryWrapper query={query}>
      {data && data.project.sequences.length > 0 ? (
        data.project.sequences.map((seq, i) => {
          const filteredShots = seq.shots
            .filter((sh) => fuzzyMatch(sh.name, search))
            .sort((a, b) => a.name.localeCompare(b.name));

          const isLast = i === data.project.sequences.length - 1;

          return (
            <div key={seq.id}>
              {filteredShots.length !== 0 ? (
                <>
                  <h2 style={{ marginBottom: 0, marginTop: 0 }}>
                    {seq.name}{" "}
                    {seq.nb_frames && <h4>({seq.nb_frames} frames)</h4>}
                  </h2>
                  <EntitiesView entities={filteredShots} listView={listView} />
                  {!isLast && <br />}
                </>
              ) : (
                search.length === 0 &&
                seq.shots.length !== 0 && (
                  <>
                    <Typography color="text.disabled">No shots...</Typography>
                    {!isLast && <br />}
                  </>
                )
              )}
            </div>
          );
        })
      ) : (
        <Typography color="text.disabled">
          The project doesn{"'"}t contain any sequences or shots...
        </Typography>
      )}
    </QueryWrapper>
  );
};

export default ShotsView;
