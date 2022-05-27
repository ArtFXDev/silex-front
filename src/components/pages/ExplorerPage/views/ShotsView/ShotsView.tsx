import { gql, useQuery } from "@apollo/client";
import AddIcon from "@mui/icons-material/Add";
import { Button, Typography } from "@mui/material";
import CreateEntityModal from "components/common/CreateEntityModal/CreateEntityModal";
import QueryWrapper from "components/utils/QueryWrapper/QueryWrapper";
import { useState } from "react";
import { useRouteMatch } from "react-router";
import { Project, Sequence } from "types/entities";
import { fuzzyMatch } from "utils/string";

import SequenceShots from "./SequenceShots";

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
          fps

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

  const numberOfShots =
    filteredSequences &&
    filteredSequences.map((e) => e.shots.length).reduce((a, b) => a + b);

  return (
    <QueryWrapper query={query}>
      {filteredSequences && data.project.sequences.length > 0 ? (
        numberOfShots !== 0 ? (
          filteredSequences.map((items, i) => {
            const { seq, shots } = items;
            const isLast = i === filteredSequences.length - 1;

            return (
              <div key={seq.id}>
                {(search.length === 0 ? true : shots.length !== 0) ? (
                  <SequenceShots
                    isLast={isLast}
                    listView={listView}
                    seq={seq}
                    setCreateEntityModal={setCreateEntityModal}
                    shots={shots}
                  />
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
