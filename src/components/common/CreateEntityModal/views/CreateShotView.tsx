/* eslint-disable camelcase */
import { gql, useApolloClient, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  FormControlLabel,
  Grid,
  ListItemButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import QueryWrapper from "components/utils/QueryWrapper/QueryWrapper";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { Sequence } from "types/entities";
import * as Zou from "utils/zou";

import { TargetEntity } from "../CreateEntityModal";

const SEQUENCES_SHOTS = gql`
  query SequencesAndShotsForProject($id: ID!) {
    project(id: $id) {
      id

      sequences {
        id
        name

        shots {
          id
          name
        }
      }

      task_types {
        id
        name
        for_shots
      }
    }
  }
`;

interface CreateShotViewProps {
  targetEntity: TargetEntity;
  onClose: () => void;
  projectIdOverride?: string;
}

const CreateShotView = ({
  targetEntity,
  projectIdOverride,
}: CreateShotViewProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newShotName, setNewShotName] = useState<string>();
  const [autoCreateTasks, setAutoCreateTasks] = useState<boolean>(true);
  const [selectedSequenceId, setSelectedSequenceId] = useState<string>(
    targetEntity ? targetEntity.id : ""
  );

  const projectIdFromURL =
    useRouteMatch<{ projectId: string }>().params.projectId;
  const projectId = projectIdOverride || projectIdFromURL;
  const { enqueueSnackbar } = useSnackbar();
  const client = useApolloClient();

  const query = useQuery<{
    project: {
      sequences: {
        id: string;
        name: string;
        shots: { id: string; name: string }[];
      }[];
      task_types: {
        id: string;
        name: string;
        for_shots: boolean;
      }[];
    };
  }>(SEQUENCES_SHOTS, {
    variables: { id: projectId },
  });
  const { data } = query;

  if (data && !selectedSequenceId) {
    setSelectedSequenceId(data.project.sequences[0].id);
  }

  const offsetShotNumber = useCallback(() => {
    if (data) {
      const sequence = data.project.sequences.find(
        (seq) => seq.id === selectedSequenceId
      ) as Sequence;

      const shots = sequence.shots
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name));

      if (shots.length > 0) {
        const lastShotName = shots[shots.length - 1].name;
        return (
          lastShotName[0] +
          (parseInt(lastShotName.slice(1)) + 10).toString().padStart(3, "0")
        );
      } else {
        return "P010";
      }
    }

    return undefined;
  }, [data, selectedSequenceId]);

  useEffect(() => {
    setNewShotName(offsetShotNumber());
  }, [offsetShotNumber, selectedSequenceId]);

  const handleClickCreateShot = () => {
    if (data && newShotName) {
      setIsLoading(true);

      Zou.createShot(projectId, selectedSequenceId, newShotName)
        .then((response) => {
          // Create all the available tasks for that shot
          if (autoCreateTasks) {
            return Promise.all(
              data.project.task_types
                .filter((t) => t.for_shots)
                .map((taskType) =>
                  Zou.createTask(
                    projectId,
                    taskType.id,
                    "Shot",
                    response.data.id
                  )
                )
            );
          }
        })
        .then(() => {
          enqueueSnackbar(`Created shot: ${newShotName}`, {
            variant: "success",
          });

          // Refresh GraphQL cache to refetch assets
          client.refetchQueries({
            include: "active",
          });
        })
        .catch((err) => {
          enqueueSnackbar(`Error when creating shot: ${err}`, {
            variant: "error",
          });
        })
        .finally(() => setIsLoading(false));
    }
  };

  const currentSequence = data?.project.sequences.find(
    (seq) => seq.id === selectedSequenceId
  );

  return (
    <QueryWrapper query={query}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Grid container>
          <Grid item xs={5}>
            <Typography sx={{ mb: 1.5 }}>For sequence: </Typography>
            <Select
              sx={{
                width: 150,
                height: 40,
                borderRadius: 3,
              }}
              value={selectedSequenceId}
              onChange={(e) => setSelectedSequenceId(e.target.value)}
              color="success"
              variant="outlined"
            >
              {data?.project.sequences.map((seq) => (
                <MenuItem key={seq.id} value={seq.id}>
                  {seq.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={7}>
            {currentSequence && currentSequence.shots.length > 0 ? (
              <>
                <Typography>Shots:</Typography>
                <Stack
                  sx={{ maxHeight: 300, overflowX: "hidden", flexWrap: "wrap" }}
                  direction={{ xs: "column", sm: "row" }}
                >
                  {currentSequence.shots
                    .slice()
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((shot) => (
                      <Paper
                        key={shot.id}
                        elevation={2}
                        sx={{ fontSize: 13, m: 0.4 }}
                      >
                        <ListItemButton sx={{ py: 0.5 }}>
                          {shot.name}
                        </ListItemButton>
                      </Paper>
                    ))}
                </Stack>{" "}
              </>
            ) : (
              <Typography color="text.disabled">No shots...</Typography>
            )}
          </Grid>
        </Grid>

        <div>
          <Typography sx={{ mb: 1.5 }}>New shot name: </Typography>
          <TextField
            fullWidth
            value={newShotName || ""}
            onChange={(e) => setNewShotName(e.target.value)}
          />
        </div>

        <FormControlLabel
          sx={{ color: "text.disabled" }}
          control={<Switch color="info" checked={autoCreateTasks} />}
          onChange={() => setAutoCreateTasks(!autoCreateTasks)}
          label="Automatically create all tasks"
        />

        <Button
          variant="contained"
          sx={{ textAlign: "left", color: "white" }}
          onClick={handleClickCreateShot}
          color="success"
        >
          Confirm and stay
          <Collapse
            in={isLoading}
            orientation="horizontal"
            sx={{
              "&.MuiCollapse-wrapperInner": {
                display: "flex",
                justifyContent: "center",
              },
            }}
          >
            <CircularProgress size={20} sx={{ ml: 2 }} color="inherit" />
          </Collapse>
        </Button>
      </Box>
    </QueryWrapper>
  );
};

export default CreateShotView;
