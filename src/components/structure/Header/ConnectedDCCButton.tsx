import { CastConnected as CastConnectedIcon } from "@mui/icons-material";
import { Badge, IconButton, IconButtonProps, Tooltip } from "@mui/material";
import { green, red } from "@mui/material/colors";
import { Link as RouterLink } from "react-router-dom";

import { useSocket } from "~/context";

/**
 * Icon showing the number of connected dccs
 */
const ConnectedDCCButton = (props: IconButtonProps): JSX.Element => {
  const socket = useSocket();

  return (
    <Tooltip title="Software connected" placement="bottom" arrow>
      <IconButton component={RouterLink} to="/dccs" sx={props.sx}>
        <Badge
          badgeContent={socket.isConnected ? socket.dccClients.length : "!"}
          showZero
          color={socket.isConnected ? "success" : "error"}
          sx={{
            "& .MuiBadge-badge": {
              boxShadow: `0 0 1px 1px ${
                socket.isConnected ? green[500] : red[500]
              }`,
            },
          }}
        >
          <CastConnectedIcon fontSize="medium" />
        </Badge>
      </IconButton>
    </Tooltip>
  );
};

export default ConnectedDCCButton;
