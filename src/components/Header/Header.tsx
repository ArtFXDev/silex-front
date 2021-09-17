import React from "react";
import { Link } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";

import AvatarMenu from "./AvatarMenu";
import SilexLogo from "style/images/silex_logo.png";
import { useAuth } from "context/AuthContext";

const Header: React.FC = () => {
  const auth = useAuth();

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>

        <img src={SilexLogo} alt="silex logo" width={50} height={50} />

        {auth.user ? (
          <AvatarMenu auth={auth} />
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
