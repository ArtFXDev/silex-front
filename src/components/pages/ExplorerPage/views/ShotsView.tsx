import { gql, useQuery } from "@apollo/client";
import AddIcon from "@mui/icons-material/Add";
import { Button, IconButton, Tooltip, Typography } from "@mui/material";
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
          data
          preview_file_id
          nb_frames
          frame_in

          validation {
            id
            frame_set
          }

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
  const [createEntityModal, setCreateEntityModal] =
    useState<{ type: "Shot" | "Sequence"; target?: Sequence }>();

  const routeMatch = useRouteMatch<{ projectId: string }>();

  const query = useQuery<{ project: Project }>(SEQUENCES_AND_SHOTS, {
    variables: { id: routeMatch.params.projectId },
  });
  const { data } = query;

  const filteredSequences =
    data &&
    data.project.sequences
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((seq) => ({
        seq,
        shots: seq.shots
          .filter((sh) => fuzzyMatch([sh.name, seq.name], search))
          .sort((a, b) => a.name.localeCompare(b.name)),
      }));

  return (
    <QueryWrapper query={query}>
      {filteredSequences && data.project.sequences.length > 0 ? (
        filteredSequences.map((e) => e.shots.length).reduce((a, b) => a + b) !==
        0 ? (
          filteredSequences.map((items, i) => {
            const { seq, shots } = items;
            const isLast = i === filteredSequences.length - 1;

            return (
              <div key={seq.id}>
                {(search.length === 0 ? true : shots.length !== 0) ? (
                  <>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {/* Sequence name */}
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

                      {/* Add new shot + button */}
                      <Tooltip title="New shot" placement="top" arrow>
                        <IconButton
                          sx={{ ml: 1.5 }}
                          onClick={() => {
                            setCreateEntityModal({
                              type: "Shot",
                              target: seq,
                            });
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                      </Tooltip>
                    </div>

                    {seq.shots.length > 0 ? (
                      <EntitiesView entities={shots} listView={listView} />
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
          <Typography color="text.disabled">No results found...</Typography>
        )
      ) : (
        <Typography color="text.disabled">
          The project doesn{"'"}t contain any sequences or shots...
        </Typography>
      )}

      <Button
        variant="outlined"
        color="secondary"
        sx={{ textTransform: "none", mt: 3 }}
        startIcon={<AddIcon />}
        onClick={() => {
          setCreateEntityModal({ type: "Sequence" });
        }}
      >
        New sequence...
      </Button>

      {createEntityModal && (
        <CreateEntityModal
          onClose={() => {
            setCreateEntityModal(undefined);
          }}
          targetEntity={createEntityModal.target}
          entityType={createEntityModal.type}
        />
      )}
    </QueryWrapper>
  );
};

export default ShotsView;
