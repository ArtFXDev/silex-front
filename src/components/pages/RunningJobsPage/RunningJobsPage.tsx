import {
  CircularProgress,
  Divider,
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
import { useBlade } from "context/BladeContext";
import { useEffect, useState } from "react";

import PageWrapper from "../PageWrapper/PageWrapper";
import ProcessRow from "./ProcessRow";
import { SystemProcess, SystemProcessRow } from "./SystemProcessRow";

const processFilter = ["vray", "kick", "maya", "houdini", "python", "hython"];

const RunningJobsPage = (): JSX.Element => {
  const { bladeStatus } = useBlade();
  const [systemProcesses, setSystemProcesses] = useState<SystemProcess[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [loadingSystemProcesses, setLoadingSystemProcesses] =
    useState<boolean>();

  const fetchSystemProcesses = () => {
    setLoadingSystemProcesses(true);
    setStatusMessage("Fetching heavy system processes...");
    const systemProcessesURL = `http://localhost:5118/desktop/processes`;
    axios
      .get<SystemProcess[]>(systemProcessesURL)
      .then((response) => {
        setSystemProcesses(
          response.data.filter((systemProcess) => {
            return (
              processFilter.includes(systemProcess.name.toLowerCase()) &&
              systemProcess.cpu > 10
            );
          })
        );
        setLoadingSystemProcesses(false);
        if (systemProcesses.length === 0) {
          setStatusMessage(
            "You don't have any heavy processes running on your computer..."
          );
        }
      })
      .catch(() => {
        setStatusMessage(
          "Could not fetch heavy system processes, make sure silex is up to date..."
        );
        setLoadingSystemProcesses(false);
      });
  };

  useEffect(() => {
    fetchSystemProcesses();
    const interval = setInterval(fetchSystemProcesses, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PageWrapper goBack title="Tasks running on this machine">
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
          </>
        ) : (
          <Typography color="text.disabled">
            You don{"'"}t have any jobs running on your computer...
          </Typography>
        )}
        <Divider sx={{ m: 3 }} />
        {systemProcesses && systemProcesses.length > 0 ? (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>PID</TableCell>
                    <TableCell>CPU Usage</TableCell>
                    <TableCell align="center">Kill</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {systemProcesses.map((p) => (
                    <SystemProcessRow
                      key={p.pid}
                      process={p}
                      killCallback={fetchSystemProcesses}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ) : loadingSystemProcesses ? (
          <Typography color="text.disabled">
            <div style={{ display: "flex", alignItems: "center" }}>
              <CircularProgress color="info" sx={{ mr: 2 }} size={20} />
              {statusMessage}
            </div>
          </Typography>
        ) : (
          <Typography color="text.disabled">{statusMessage}</Typography>
        )}
      </div>
    </PageWrapper>
  );
};

export default RunningJobsPage;
