import { Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import MenuIcon from "@material-ui/icons/Menu";
import Avatar from "@material-ui/core/Avatar";

import SilexLogo from "../../style/images/silex_logo.png";
import { AuthContext, useAuth } from "../../context/AuthContext";
import { pictureThumbnailURL } from "../../utils/kitsu";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import React, { useState } from "react";

const useStyles = makeStyles((theme) => ({
  logo: {
    flexGrow: 1,
    maxWidth: 50,
    marginRight: "auto",
    margin: 10,
  },
  navRight: {
    justifyContent: "flex-end",
  },
}));

const AvatarWithMenu: React.FC<{ auth: AuthContext }> = ({ auth }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!auth.user) return <div>NO USER</div>;

  return (
    <div>
      <Avatar
        alt={`${auth.user.first_name} ${auth.user.last_name}`}
        src={pictureThumbnailURL("persons", auth.user.id)}
        onClick={handleMenu}
      />
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
      </Menu>
    </div>
  );
};

const Header: React.FC = () => {
  const classes = useStyles();
  const auth = useAuth();

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>

        <img src={SilexLogo} alt="silex logo" className={classes.logo} />

        {auth.user ? (
          <AvatarWithMenu auth={auth} />
        ) : (
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
