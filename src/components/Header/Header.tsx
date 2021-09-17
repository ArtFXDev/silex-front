import React from "react";
import { Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import MenuIcon from "@material-ui/icons/Menu";

import AvatarMenu from "./AvatarMenu";
import SilexLogo from "style/images/silex_logo.png";
import { useAuth } from "context/AuthContext";

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
