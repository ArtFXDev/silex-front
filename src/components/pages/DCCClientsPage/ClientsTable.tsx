import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { DCCContext } from "~/types/action/context";

import ClientRow from "./ClientRow";

interface ClientsTableProps {
  clients: DCCContext[];
}

const ClientsTable = ({ clients }: ClientsTableProps): JSX.Element => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>DCC</TableCell>
            <TableCell>PID</TableCell>
            <TableCell>Project</TableCell>
            <TableCell>Sequence</TableCell>
            <TableCell>Shot</TableCell>
            <TableCell>Task</TableCell>
            <TableCell>Running actions</TableCell>
            <TableCell align="center">Kill</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {clients.map((dcc) => dcc && <ClientRow dcc={dcc} key={dcc.uuid} />)}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ClientsTable;
