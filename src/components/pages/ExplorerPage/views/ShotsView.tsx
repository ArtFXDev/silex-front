import { gql, useQuery } from "@apollo/client";

import { Project } from "types";
import QueryWrapper from "components/QueryWrapper/QueryWrapper";
import EntitiesView from "./EntitiesView";
import { useRouteMatch } from "react-router";

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

const ShotsView = ({ listView }: { listView: boolean }): JSX.Element => {
  const routeMatch = useRouteMatch<{ projectId: string }>();

  const query = useQuery<{ project: Project }>(SEQUENCES_AND_SHOTS, {
    variables: { id: routeMatch.params.projectId },
  });
  const { data } = query;

  return (
    <QueryWrapper query={query}>
      {data &&
        data.project.sequences.map((seq, i) => (
          <div key={seq.id}>
            <h2 style={{ marginBottom: 0, marginTop: 0 }}>
              {seq.name} {seq.nb_frames && <h4>({seq.nb_frames} frames)</h4>}
            </h2>
            <EntitiesView entities={seq.shots} listView={listView} />
            {i !== data.project.sequences.length - 1 && <br />}
          </div>
        ))}
    </QueryWrapper>
  );
};

export default ShotsView;
