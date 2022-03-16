import DangerousIcon from "@mui/icons-material/Dangerous";
import { IconButton, TableCell, TableRow } from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";

export interface SystemProcess {
  name: string;
  pid: number;
  cpu: number;
  mem: {
    private: number;
    virtual: number;
    usage: number;
  };
}

export const SystemProcessRow = ({
  p,
  killCallback,
}: {
  p: SystemProcess;
  killCallback: () => void;
}): JSX.Element => {
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = (pid: number) => {
    enqueueSnackbar("Kill active process request sent", {
      variant: "info",
    });

    window.electron.send("setNimbyStatus", true);
    const killProcessesURL = `http://localhost:5119/kill/${pid}`;
    axios
      .post(killProcessesURL)
      .then((response) => {
        console.log(response);
        killCallback();
        enqueueSnackbar("Process successfully killed", {
          variant: "success",
        });
      })
      .catch(() => {
        enqueueSnackbar("Error occured while killing the process", {
          variant: "error",
        });
      });
  };

  return (
    <>
      <TableRow key={p.pid}>
        <TableCell>{p.name}</TableCell>
        <TableCell>{p.pid}</TableCell>
        <TableCell>{p.cpu}</TableCell>
        <TableCell align="center">
          <IconButton
            onClick={() => handleClick(p.pid)}
            aria-label="kill"
            color="error"
          >
            <DangerousIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  );
};
