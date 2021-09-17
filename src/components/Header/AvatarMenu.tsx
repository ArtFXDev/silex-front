import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { AuthContext } from "context/AuthContext";
import * as Kitsu from "utils/kitsu";
import ColorHash from "color-hash";

const AvatarMenu: React.FC<{ auth: AuthContext }> = ({ auth }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const colorHash = new ColorHash({ lightness: 0.7, saturation: 0.8 });

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onLogout = () => {
    Kitsu.logout().then((_response) => {
      auth.signout();
    });
  };

  if (!auth.user) return <div>NO USER</div>;

  return (
    <div>
      <Avatar
        alt={auth.user.fullName()}
        src={
          auth.user.has_avatar
            ? Kitsu.pictureThumbnailURL("persons", auth.user.id)
            : ""
        }
        onClick={handleMenu}
        sx={{
          backgroundColor: colorHash.hex(auth.user.fullName()),
        }}
      >
        {!auth.user.has_avatar && auth.user.firstTwoLetters()}
      </Avatar>

      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={onLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

export default AvatarMenu;
