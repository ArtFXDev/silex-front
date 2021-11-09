import { Menu as MenuIcon } from "@mui/icons-material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { AppBar, Box, IconButton, Toolbar, Tooltip } from "@mui/material";
import SilexLogo from "assets/images/silex_logo.png";
import SilexText from "assets/images/silex_text.png";
import NimbyController from "components/common/NimbyController/NimbyController";
import Menu from "components/structure/Menu/Menu";
import isElectron from "is-electron";
import { useState } from "react";
import { useHistory } from "react-router-dom";

import AvatarMenu from "./AvatarMenu";
import ConnectedDCCButton from "./ConnectedDCCButton";

/**
 * The Silex logo and text displayed on the top left
 */
const SilexLogoAndText = (): JSX.Element => {
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

/**
 * Header component visible on most of the pages
 */
const Header = (): JSX.Element => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        {/* Hamburger menu icon */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={() => setMenuOpen(true)}
        >
          <MenuIcon />
        </IconButton>

        {/* Menu component */}
        <Menu open={menuOpen} closeMenu={() => setMenuOpen(false)} />

        <SilexLogoAndText />

        <Tooltip title="Refresh data" placement="bottom" arrow>
          <IconButton
            onClick={() => window.location.reload()}
            sx={{
              transition: "all 0.7s cubic-bezier(0, 0.55, 0.45, 1)",
              ":hover": { transform: "rotate(360deg)" },
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>

        <ConnectedDCCButton sx={{ ml: 2, mr: 3 }} />

        {isElectron() && <NimbyController sx={{ mr: 3 }} />}

        <AvatarMenu />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
