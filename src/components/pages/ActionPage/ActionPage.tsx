import { Box, Button, List, Typography } from "@mui/material";
import { useAction, useSocket } from "context";

import PageWrapper from "../PageWrapper/PageWrapper";
import StepItem from "./StepItem";
import { capitalize } from "utils/string";
import { Status } from "types/action/status";

const ActionPage: React.FC = () => {
  const { action } = useAction();
  const { socket } = useSocket();

  if (!action) return <PageWrapper title={`No action...`} />;

  const handleClickOnAction = () => {
    // TODO: hack
    for (const step of Object.values(action.steps)) {
      for (const cmd of Object.values(step.commands)) {
        if (cmd.status === Status.WAITING_FOR_RESPONSE) {
          cmd.ask_user = false;
        }
      }
    }

    socket.emit("actionUpdate", action, (data) => {
      console.log(data);
    });
  };

  return (
    <PageWrapper>
      <Box sx={{ width: 800 }}>
        <Box sx={{ mb: 3 }}>
          <Typography
            color="text.disabled"
            variant="h5"
            sx={{ display: "inline-block", mr: 2 }}
            display="inline-block"
          >
            Action:
          </Typography>

          <Typography variant="h4" display="inline-block">
            {capitalize(action.name)}
          </Typography>
        </Box>

        <List>
          {Object.values(action.steps).map(
            (step) => !step.hide && <StepItem key={step.uuid} step={step} />
          )}
        </List>

        <Button
          variant="contained"
          sx={{ float: "right" }}
          onClick={handleClickOnAction}
        >
          {action.name}
        </Button>
      </Box>
    </PageWrapper>
  );
};

export default ActionPage;
