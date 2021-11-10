import { Typography } from "@mui/material";
import axios from "axios";
import Logs from "components/common/Logs/Logs";
import Separator from "components/common/Separator/Separator";
import { useEffect, useState } from "react";
import { LogLine } from "types/action/action";

import PageWrapper from "../PageWrapper/PageWrapper";

interface LogFileProps {
  fileName: string;
  title: string;
}

const LogFile = ({ fileName, title }: LogFileProps) => {
  const [logs, setLogs] = useState<LogLine[]>();

  useEffect(() => {
    const getLog = () => {
      axios
        .get<string[]>(
          `${process.env.REACT_APP_WS_SERVER}/log/${fileName}?fromEnd=50`
        )
        .then((response) =>
          setLogs(response.data.map((l) => ({ message: l })))
        );
    };

    getLog();
    const interval = setInterval(getLog, 1000);
    return () => clearInterval(interval);
  }, [fileName]);

  return (
    <div style={{ marginBottom: "50px" }}>
      <Typography sx={{ my: 3 }} variant="h6">
        {title}
      </Typography>
      {logs && <Logs logs={logs} regexp={/(\[.+\]) (.+) (\(.+\):) (.+)/g} />}
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
