import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Button, CircularProgress, Collapse } from "@mui/material";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";

import CollapseError from "~/components/common/CollapseError/CollapseError";

const KillJobsButton = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>();
  const [error, setError] = useState<unknown>();
  const [success, setSuccess] = useState<boolean>();

  const { enqueueSnackbar } = useSnackbar();

  const onOperationSuccess = useCallback(
    (data: { channel: string }) => {
      if (data.channel === "killAllActiveTasksOnBlade") {
        setIsLoading(false);
        setSuccess(true);
        enqueueSnackbar("Kill active tasks on this blade successfully sent!", {
          variant: "success",
        });
      }
    },
    [enqueueSnackbar]
  );

  const onOperationError = useCallback(
    (data: { channel: string; error: unknown }) => {
      if (data.channel === "killAllActiveTasksOnBlade") {
        setError(data.error);
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    window.electron.receive<{ channel: string }>(
      "operationSuccess",
      onOperationSuccess
    );

    window.electron.receive<{ channel: string; error: unknown }>(
      "operationError",
      onOperationError
    );

    return () => {
      window.electron.removeListener("operationSuccess", onOperationSuccess);
      window.electron.removeListener("operationError", onOperationError);
    };
  }, [onOperationError, onOperationSuccess]);

  const handleClick = () => {
    if (!isLoading && !success) {
      setIsLoading(true);
      setSuccess(false);
      window.electron.send("setNimbyStatus", true);
      window.electron.send("killAllActiveTasksOnBlade");
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        sx={{
          mt: 3,
          textTransform: "none",
          display: "flex",
          justifyContent: "center",
        }}
        onClick={handleClick}
        color={success ? "success" : "error"}
      >
        <span>Kill all running tasks</span>
        <Collapse in={isLoading || success} orientation="horizontal">
          {isLoading && <CircularProgress size={20} sx={{ ml: 2 }} />}
          {success && <CheckCircleOutlineIcon color="success" sx={{ ml: 2 }} />}
        </Collapse>
      </Button>

      {error && (
        <CollapseError
          sx={{ mt: 3 }}
          name="Error when trying to kill the task processes"
          message="Check that tractor is accessible or Go kill process is running as a service"
          error={error}
        />
      )}
    </>
  );
};

export default KillJobsButton;
