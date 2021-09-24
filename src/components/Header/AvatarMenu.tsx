import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import { Logout, AccountCircle } from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip";

import { useAuth } from "context";
import * as Kitsu from "utils/kitsu";
import UserAvatar from "components/UserAvatar/UserAvatar";

const AvatarMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const auth = useAuth();
  const history = useHistory();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onLogout = () => {
    Kitsu.logout().then((_response) => {
      auth.signout();
      history.push("/");
    });
  };

  if (!auth.user) return <div>NO USER</div>;

  return (
    <Tooltip title="User settings" placement="left">
      <div>
        <UserAvatar onClick={handleMenu} size={45} clickable />

        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose} component={Link} to="/profile">
            <ListItemIcon>
              <AccountCircle fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>

          <MenuItem onClick={onLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </div>
    </Tooltip>
  );
};

export default AvatarMenu;
