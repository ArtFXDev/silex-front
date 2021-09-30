import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Box } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";

import AvatarMenu from "./AvatarMenu";
import SilexLogo from "assets/images/silex_logo.png";
import SilexText from "assets/images/silex_text.png";
import Menu from "components/Menu/Menu";
import ConnectedDCCButton from "./ConnectedDCCButton";

const SilexLogoAndText: React.FC = () => {
  const history = useHistory();
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        marginRight: "auto",
        marginLeft: "10px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          cursor: "pointer",
          alignItems: "center",
          transition: "all 0.2s ease",
          ":hover": {
            transform: "scale(1.1)",
          },
        }}
      >
        <img
          src={SilexLogo}
          alt="silex logo"
          width={50}
          height={50}
          style={{ marginRight: "10px" }}
          onClick={() => history.push("/")}
        />
      </Box>
      <img src={SilexText} alt="silex text" width={70} />
    </Box>
  );
};

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={() => setMenuOpen(true)}
        >
          <MenuIcon />
        </IconButton>

        <Menu open={menuOpen} closeMenu={() => setMenuOpen(false)} />

        <SilexLogoAndText />

        <ConnectedDCCButton sx={{ ml: 2.5, mr: 3 }} />

        <AvatarMenu />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
