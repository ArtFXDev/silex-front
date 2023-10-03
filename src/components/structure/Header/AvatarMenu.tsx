import { AccountCircle, Logout } from "@mui/icons-material";
import { Button, ListItemIcon, Menu, MenuItem, Paper } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { Link, Link as RouterLink, useNavigate } from "react-router-dom";

import SilexCoinIcon from "~/assets/images/silex_coin.svg";
import { PersonAvatar } from "~/components/common/avatar";
import { useAuth } from "~/context";
import * as Zou from "~/utils/zou";

/**
 * Avatar profile picture with a menu
 */
const AvatarMenu = (): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const auth = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onLogout = () => {
    Zou.logout()
      .then(auth.signout)
      .catch((err) =>
        enqueueSnackbar(`Logout error: ${err}`, { variant: "error" })
      )
      .finally(() => navigate("/login"));
  };

  if (!auth.user)
    return (
      <Button component={RouterLink} to="/login">
        Log In
      </Button>
    );

  return (
    <div>
      <div style={{ position: "relative" }}>
        <PersonAvatar
          person={auth.user}
          onClick={handleMenu}
          size={42}
          clickable
        />

        <Paper
          elevation={1}
          sx={{
            position: "absolute",
            bottom: -5,
            right: -5,
            display: "flex",
            alignItems: "center",
            borderRadius: "9999px",
            px: 0.6,
            py: 0.2,
          }}
        >
          <p
            style={{
              fontSize: 9,
              margin: 0,
              paddingRight: 2,
            }}
          >
            {auth.user.coins || 0}
          </p>
          <img width={12} height={12} src={SilexCoinIcon} />
        </Paper>
      </div>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleClose} component={Link} to="/profile">
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>

        <MenuItem onClick={handleClose} component={Link} to="/coins">
          <ListItemIcon>
            <img width={22} height={22} src={SilexCoinIcon} />
          </ListItemIcon>
          Coins
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
