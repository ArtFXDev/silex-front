import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  Button,
  CircularProgress,
  Collapse,
  IconButton,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import CollapseError from "components/common/CollapseError/CollapseError";
import Logs from "components/common/Logs/Logs";
import { useBlade } from "context/BladeContext";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { LogLine } from "types/action/action";
import { RunningJob } from "types/tractor/blade";
import { secondsToDhms } from "utils/date";

import PageWrapper from "../PageWrapper/PageWrapper";

const ProcessRow = ({ p }: { p: RunningJob }): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);
  const [logs, setLogs] = useState<LogLine[]>();

  useEffect(() => {
    const fetchLogs = () => {
      const logsURL = `http://tractor/tractor/cmd-logs/${p.login}/J${p.jid}/T${p.tid}.log`;
      axios
        .get<string>(logsURL)
        .then((response) =>
          setLogs(response.data.split("\n").map((l) => ({ message: l })))
        );
    };

    if (open) {
      fetchLogs();
      const interval = setInterval(fetchLogs, 2000);
      return () => clearInterval(interval);
    }
  }, [open, p.jid, p.login, p.tid]);

  return (
    <>
      <TableRow key={p.pid}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{p.pid}</TableCell>
        <TableCell>
          <Link
            sx={{ cursor: "pointer" }}
            onClick={() => window.open(`http://tractor/tv/#jid=${p.jid}`)}
          >
            {p.jid}
          </Link>
        </TableCell>
        <TableCell>{p.tid}</TableCell>
        <TableCell>{p.login}</TableCell>
        <TableCell>{secondsToDhms(p.elapsed)}</TableCell>
        <TableCell>{p.state}</TableCell>
        <TableCell>{p.argv.join(" ")}</TableCell>
      </TableRow>

      <TableRow sx={{ backgroundColor: "none" }}>
        <TableCell sx={{ py: 0, px: 0 }} colSpan={8}>
          <Collapse in={open}>{logs && <Logs logs={logs} />}</Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const KillJobsButton = ({
  hnm,
  nimbyON,
}: {
  hnm: string;
  nimbyON: boolean;
}): JSX.Element => {
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
  }, [enqueueSnackbar, onOperationError, onOperationSuccess]);

  const handleClick = () => {
    if (!isLoading && !success) {
      setIsLoading(true);
      setSuccess(false);
      window.electron.send("killAllActiveTasksOnBlade", hnm);
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
        disabled={!nimbyON}
        color={success ? "success" : "error"}
      >
        <span>Kill all running tasks</span>
        <Collapse in={isLoading || success} orientation="horizontal">
          {isLoading && <CircularProgress size={20} sx={{ ml: 2 }} />}
          {success && <CheckCircleOutlineIcon color="success" sx={{ ml: 2 }} />}
        </Collapse>
      </Button>

      {!nimbyON && (
        <Typography fontSize={15} color="error" sx={{ mt: 1 }}>
          To kill tasks on this computer, set the nimby value to ON
        </Typography>
      )}

      {error && (
        <CollapseError
          sx={{ mt: 3 }}
          name="Error: Kill running tasks on this blade"
          message="Check that tractor is accessible"
          error={error}
        />
      )}
    </>
  );
};

const RunningJobsPage = (): JSX.Element => {
  const { bladeStatus } = useBlade();

  return (
    <PageWrapper goBack title="Jobs running on this machine">
      <div style={{ marginTop: "20px" }}>
        {bladeStatus && bladeStatus.pids.length > 0 ? (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Open Logs</TableCell>
                    <TableCell>PID</TableCell>
                    <TableCell>JID</TableCell>
                    <TableCell>TID</TableCell>
                    <TableCell>Owner</TableCell>
                    <TableCell>Elapsed time</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Argv</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {bladeStatus.pids.map((p) => (
                    <ProcessRow key={p.pid} p={p} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <KillJobsButton
              hnm={bladeStatus.hnm}
              nimbyON={bladeStatus.nimbyON}
            />
          </>
        ) : (
          <Typography color="text.disabled">
            You don{"'"}t have any jobs running on your computer...
          </Typography>
        )}
      </div>
    </PageWrapper>
  );
};

export default RunningJobsPage;
