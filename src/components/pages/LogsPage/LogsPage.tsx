import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Chip, IconButton, Tooltip, Typography } from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";

import Logs from "~/components/common/Logs/Logs";
import Separator from "~/components/common/Separator/Separator";
import { LogLine } from "~/types/action/action";

import PageWrapper from "../PageWrapper/PageWrapper";

interface LogFileProps {
  fileName: string;
  title: string;
}

type LogsResponse = { totalLines: number; lines: LogLine[] };

const LogFile = ({ fileName, title }: LogFileProps) => {
  const [logs, setLogs] = useState<LogsResponse>();
  const [lines, setLines] = useState<number>(50);

  const { enqueueSnackbar } = useSnackbar();

  const fetchLogs = useCallback(() => {
    axios
      .get<{ totalLines: number; lines: string[] }>(
        `${import.meta.env.VITE_WS_SERVER}/log/${fileName}?fromEnd=${lines}`
      )
      .then((response) => {
        setLogs({
          ...response.data,
          lines: response.data.lines.map((l) => ({ message: l })),
        });
      });
  }, [fileName, lines]);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 2000);
    return () => clearInterval(interval);
  }, [fetchLogs]);

  const handleClearLog = () => {
    axios
      .delete(`${import.meta.env.VITE_WS_SERVER}/log/${fileName}`)
      .then(() => {
        enqueueSnackbar(`Cleared logfile ${fileName}`, { variant: "success" });
        fetchLogs();
      })
      .catch((err) =>
        enqueueSnackbar(`Couldn't clear logfile ${fileName}: ${err}`, {
          variant: "error",
        })
      );
  };

  return (
    <div style={{ marginBottom: "50px" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Typography sx={{ my: 3 }} variant="h6">
          {title}
        </Typography>

        {logs && logs.lines.length > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: "auto",
            }}
          >
            <div style={{ display: "flex", gap: "10px", marginRight: "10px" }}>
              {[50, 100, 500].map((n) => (
                <Chip
                  key={n}
                  label={n}
                  variant={lines === n ? "filled" : "outlined"}
                  color={lines === n ? "info" : "default"}
                  onClick={() => setLines(n)}
                />
              ))}
            </div>

            <Tooltip title="Clear log file">
              <IconButton onClick={handleClearLog}>
                <DeleteOutlineIcon color="error" />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </div>

      {logs && logs.lines.length > 0 ? (
        <Logs
          logs={logs.lines}
          regexp={/(\[.*\]) (.+:) (\[.*\]) (.*)/g}
          scrollToBottom
          linesOffset={
            logs.totalLines -
            (logs.lines.length === lines ? lines : logs.lines.length)
          }
        />
      ) : (
        <Typography color="text.disabled">Log file is empty...</Typography>
      )}
    </div>
  );
};

const LogsPage = (): JSX.Element => {
  return (
    <PageWrapper title="Logs" goBack>
      <LogFile
        title="Silex Socket Service"
        fileName=".silex_socket_service_log"
      />
      <Separator />
      <LogFile title="Silex Desktop" fileName=".silex_desktop_log" />
    </PageWrapper>
  );
};

export default LogsPage;
