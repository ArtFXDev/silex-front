import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
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
import Logs from "components/common/Logs/Logs";
import { useBlade } from "context/BladeContext";
import { useEffect, useState } from "react";
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
        <TableCell>
          <IconButton>
            <DeleteOutlineIcon color="error" />
          </IconButton>
        </TableCell>
      </TableRow>

      <TableRow sx={{ backgroundColor: "none" }}>
        <TableCell sx={{ py: 0, px: 0 }} colSpan={8}>
          <Collapse in={open}>{logs && <Logs logs={logs} />}</Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const RunningJobsPage = (): JSX.Element => {
  const { bladeStatus } = useBlade();

  return (
    <PageWrapper goBack title="Running jobs">
      <div style={{ marginTop: "20px" }}>
        {bladeStatus && bladeStatus.pids.length > 0 ? (
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
                  <TableCell>Kill job</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {bladeStatus.pids.map((p) => (
                  <ProcessRow key={p.pid} p={p} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
