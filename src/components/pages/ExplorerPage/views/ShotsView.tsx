import { gql, useQuery } from "@apollo/client";
import AddIcon from "@mui/icons-material/Add";
import { IconButton, Typography } from "@mui/material";
import CreateEntityModal from "components/common/CreateEntityModal/CreateEntityModal";
import QueryWrapper from "components/utils/QueryWrapper/QueryWrapper";
import { useState } from "react";
import { useRouteMatch } from "react-router";
import { Project, Sequence } from "types/entities";
import { fuzzyMatch } from "utils/string";

import EntitiesView from "./EntitiesView";

const SEQUENCES_AND_SHOTS = gql`
  query SequencesAndShots($id: ID!) {
    project(id: $id) {
      id

      sequences {
        id
        name

        shots {
          id
          name
          type
          preview_file_id

          tasks {
            id

            taskStatus {
              id
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
  const [createShotModal, setCreateShotModal] = useState<boolean>(false);
  const [choosenSequence, setChoosenSequence] = useState<Sequence>();
  const routeMatch = useRouteMatch<{ projectId: string }>();

  const query = useQuery<{ project: Project }>(SEQUENCES_AND_SHOTS, {
    variables: { id: routeMatch.params.projectId },
  });
  const { data } = query;

  return (
    <QueryWrapper query={query}>
      {data && data.project.sequences.length > 0 ? (
        data.project.sequences
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((seq, i) => {
            const filteredShots = seq.shots
              .filter((sh) => fuzzyMatch(sh.name, search))
              .sort((a, b) => a.name.localeCompare(b.name));

            const isLast = i === data.project.sequences.length - 1;

            return (
              <div key={seq.id}>
                {(search.length === 0 ? true : filteredShots.length !== 0) ? (
                  <>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <h2
                        style={{
                          display: "inline-block",
                          marginBottom: 0,
                          marginTop: 0,
                        }}
                      >
                        {seq.name}{" "}
                        {seq.nb_frames && <h4>({seq.nb_frames} frames)</h4>}
                      </h2>

                      <IconButton
                        sx={{ ml: 1.5 }}
                        onClick={() => {
                          setCreateShotModal(true);
                          setChoosenSequence(seq);
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    </div>

                    {seq.shots.length > 0 ? (
                      <EntitiesView
                        entities={filteredShots}
                        listView={listView}
                      />
                    ) : (
                      <Typography color="text.disabled" mt={2}>
                        No shots...
                      </Typography>
                    )}

                    {!isLast && <br />}
                  </>
                ) : (
                  search.length === 0 && (
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

      {createShotModal && (
        <CreateEntityModal
          onClose={() => setCreateShotModal(false)}
          targetEntity={choosenSequence}
          entityType="Shot"
        />
      )}
    </QueryWrapper>
  );
};

export default ShotsView;
