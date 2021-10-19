import { Box, Button, Fade, List, Typography } from "@mui/material";
import { useAction, useSocket } from "context";
import { useSnackbar } from "notistack";
import { Action } from "types/action/action";
import { Status } from "types/action/status";
import { capitalize } from "utils/string";

import PageWrapper from "../PageWrapper/PageWrapper";
import StepItem from "./StepItem";

const someStepsAreWaitingForInput = (action: Action) =>
  Object.values(action.steps).some(
    (step) => step.status === Status.WAITING_FOR_RESPONSE
  );

const ActionPage = (): JSX.Element => {
  const { action } = useAction();
  const { uiSocket } = useSocket();
  const { enqueueSnackbar } = useSnackbar();

  if (!action) return <PageWrapper title={`No action...`} />;

  const handleClickOnAction = () => {
    // TODO: hack
    for (const step of Object.values(action.steps)) {
      for (const cmd of Object.values(step.commands)) {
        if (cmd.status === Status.WAITING_FOR_RESPONSE) {
          // eslint-disable-next-line camelcase
          cmd.ask_user = false;
        }
      }
    }

    uiSocket.emit("actionUpdate", action, (data) => {
      enqueueSnackbar(`Action ${action.name} sent (${data.status})`, {
        variant: "success",
      });
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

        <Fade in={someStepsAreWaitingForInput(action)}>
          <Button
            variant="contained"
            sx={{ float: "right" }}
            onClick={handleClickOnAction}
          >
            {action.name}
          </Button>
        </Fade>
      </Box>
    </PageWrapper>
  );
};

export default ActionPage;
