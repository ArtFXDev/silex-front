import { Link as RouterLink } from "react-router-dom";
import { Badge, IconButton, IconButtonProps } from "@mui/material";
import { CastConnected as CastConnectedIcon } from "@mui/icons-material";
import { green, red } from "@mui/material/colors";

import { useSocket } from "context";

const ConnectedDCCButton: React.FC<IconButtonProps> = (props) => {
  const socket = useSocket();

  return (
    <IconButton component={RouterLink} to="/dccs" sx={props.sx}>
      <Badge
        badgeContent={socket.isConnected ? socket.dccClients.length : "!"}
        showZero
        color={socket.isConnected ? "success" : "error"}
        sx={{
          "& .MuiBadge-badge": {
            color: "grey",
            boxShadow: `0 0 1px 1px ${
              socket.isConnected ? green[500] : red[500]
            }`,
          },
        }}
      >
        <CastConnectedIcon fontSize="medium" />
      </Badge>
    </IconButton>
  );
};

export default ConnectedDCCButton;
