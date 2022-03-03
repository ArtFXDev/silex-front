import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Collapse, IconButton, Link, TableCell, TableRow } from "@mui/material";
import axios from "axios";
import Logs from "components/common/Logs/Logs";
import { useEffect, useState } from "react";
import { LogLine } from "types/action/action";
import { RunningJob } from "types/tractor/blade";
import { secondsToDhms } from "utils/date";

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

export default ProcessRow;
