import DescriptionIcon from "@mui/icons-material/Description";
import { IconButton, Tooltip } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

interface OpenLogsButton {
  onClick?: () => void;
}

const OpenLogsButton = ({ onClick }: OpenLogsButton): JSX.Element => {
  return (
    <Tooltip title="Logs" placement="top" arrow sx={{ ml: 0.8 }}>
      <IconButton component={RouterLink} to="/logs" onClick={onClick}>
        <DescriptionIcon color="disabled" />
      </IconButton>
    </Tooltip>
  );
};

export default OpenLogsButton;
