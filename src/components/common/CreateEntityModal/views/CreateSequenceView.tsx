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
import * as Zou from "utils/zou";

interface CreateSequenceViewProps {
  onClose: () => void;
}

const CreateSequenceView = ({
  onClose,
}: CreateSequenceViewProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newSequenceName, setNewSequenceName] = useState<string>("");

  const { projectId } = useRouteMatch<{ projectId: string }>().params;
  const { enqueueSnackbar } = useSnackbar();
  const client = useApolloClient();

  const handleClick = () => {
    Zou.createSequence(projectId, null, newSequenceName)
      .then(() => {
        enqueueSnackbar(`Created sequence: ${name}`, {
          variant: "success",
        });

        // Refresh GraphQL cache to refetch assets
        client.refetchQueries({ include: ["SequencesAndShots"] });

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
