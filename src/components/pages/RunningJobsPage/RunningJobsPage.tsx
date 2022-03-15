import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useBlade } from "context/BladeContext";

import PageWrapper from "../PageWrapper/PageWrapper";
import KillJobsButton from "./KillJobsButton";
import ProcessRow from "./ProcessRow";

const RunningJobsPage = (): JSX.Element => {
  const { bladeStatus } = useBlade();

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

            <KillJobsButton />
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
