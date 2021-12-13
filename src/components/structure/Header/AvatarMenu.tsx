import { AccountCircle, Logout } from "@mui/icons-material";
import { Button, ListItemIcon, Menu, MenuItem } from "@mui/material";
import { PersonAvatar } from "components/common/avatar";
import { useAuth } from "context";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { Link, Link as RouterLink, useHistory } from "react-router-dom";
import * as Zou from "utils/zou";

/**
 * Avatar profile picture with a menu
 */
const AvatarMenu = (): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const auth = useAuth();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onLogout = () => {
    Zou.logout()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .then((_response) => {
        auth.signout();
        history.push("/login");
      })
      .catch((err) =>
        enqueueSnackbar(`Logout error: ${err}`, { variant: "error" })
      );
  };

  if (!auth.user)
    return (
      <Button component={RouterLink} to="/login">
        Log In
      </Button>
    );

  return (
    <div>
      <PersonAvatar
        person={auth.user}
        onClick={handleMenu}
        size={42}
        clickable
      />

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
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
  );
};

export default AvatarMenu;
