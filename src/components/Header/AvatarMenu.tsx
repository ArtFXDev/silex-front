import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { ListItemIcon, Menu, MenuItem, Tooltip } from "@mui/material";
import { AccountCircle, Logout } from "@mui/icons-material";

import { useAuth } from "context";
import * as Zou from "utils/zou";
import { PersonAvatar } from "components/avatar";

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Zou.logout().then((_response) => {
      auth.signout();
      history.push("/login");
    });
  };

  if (!auth.user) return <div>NO USER</div>;

  return (
    <Tooltip title="User settings" placement="left">
      <div>
        <PersonAvatar
          person={auth.user}
          onClick={handleMenu}
          size={45}
          clickable
        />

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
