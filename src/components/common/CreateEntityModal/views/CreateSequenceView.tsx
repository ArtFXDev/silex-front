import { useApolloClient } from "@apollo/client";
import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useRouteMatch } from "react-router-dom";

import * as Zou from "~/utils/zou";

interface CreateSequenceViewProps {
  onClose: () => void;
  projectIdOverride?: string;
}

const CreateSequenceView = ({
  onClose,
  projectIdOverride,
}: CreateSequenceViewProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newSequenceName, setNewSequenceName] = useState<string>("S01");

  const projectIdFromURL = useRouteMatch<{ projectId: string }>().params
    .projectId;
  const projectId = projectIdOverride || projectIdFromURL;

  const { enqueueSnackbar } = useSnackbar();
  const client = useApolloClient();

  const handleClick = () => {
    Zou.createSequence(projectId, null, newSequenceName)
      .then(() => {
        enqueueSnackbar(`Created sequence: ${newSequenceName}`, {
          variant: "success",
        });

        client.refetchQueries({ include: "active" });

        // Close the window
        onClose();
      })
      .catch((err) => {
        enqueueSnackbar(`Error when creating sequence: ${err}`, {
          variant: "error",
        });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <div>
        <Typography sx={{ mb: 1.5 }}>Name:</Typography>
        <TextField
          fullWidth
          value={newSequenceName}
          onChange={(e) => setNewSequenceName(e.target.value)}
        />
      </div>

      <Button
        variant="contained"
        sx={{ textAlign: "left", color: "white" }}
        color="success"
        onClick={handleClick}
      >
        Create
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
  );
};

export default CreateSequenceView;
