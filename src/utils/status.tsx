import CheckIcon from "@mui/icons-material/Check";
import CreateIcon from "@mui/icons-material/Create";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { CircularProgress } from "@mui/material";
import { Status } from "types/action/status";

/**
 * Returns a color from a status.
 * @param status the status of a command or a step
 * @returns a MUI color
 */
export const getStatusColor = (status: Status | undefined): string => {
  switch (status) {
    case Status.COMPLETED:
      return "success.dark";
    case Status.ERROR:
      return "error.dark";
    case Status.PROCESSING:
      return "info.main";
    case Status.INVALID:
      return "warning.dark";
    case Status.INITIALIZED:
      return "";
    case Status.WAITING_FOR_RESPONSE:
      return "info.main";
    default:
      return "";
  }
};

/**
 * Returns the appropriate icon component associated with a status
 * @param status the status of a command or a step
 * @param iconColor include the color
 * @returns a JSX element or nothing if the status is not known
 */
export const getStatusIcon = (
  status: Status,
  iconColor?: boolean
): JSX.Element => {
  const sx = iconColor ? { color: getStatusColor(status) } : undefined;

  switch (status) {
    case Status.COMPLETED:
      return <CheckIcon sx={{ ...sx }} />;
    case Status.ERROR:
      return <ErrorOutlineIcon sx={{ ...sx }} />;
    case Status.PROCESSING:
      return (
        <CircularProgress
          size={25}
          color="inherit"
          sx={{ ...sx }}
          disableShrink
        />
      );
    case Status.INVALID:
      return <WarningAmberIcon sx={{ ...sx }} />;
    case Status.INITIALIZED:
      return <MoreHorizIcon sx={{ ...sx }} />;
    case Status.WAITING_FOR_RESPONSE:
      return <CreateIcon sx={{ ...sx }} />;
    default:
      throw new Error("Status not handled");
  }
};
