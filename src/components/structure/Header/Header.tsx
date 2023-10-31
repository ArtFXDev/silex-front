import { Menu as MenuIcon } from "@mui/icons-material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { AppBar, Box, IconButton, Toolbar, Tooltip } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import SilexText from "~/assets/images/silex_text.png";
import SilexLogo from "~/components/common/SilexLogo/SilexLogo";
import Menu from "~/components/structure/Menu/Menu";

import AvatarMenu from "./AvatarMenu";
import ConnectedDCCButton from "./ConnectedDCCButton";

/**
 * The Silex logo and text displayed on the top left
 */
const SilexLogoAndText = (): JSX.Element => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        marginRight: "auto",
        marginLeft: "10px",
      }}
    >
      <SilexLogo
        size={48}
        sx={{
          marginRight: "10px",
          display: "flex",
          cursor: "pointer",
          alignItems: "center",
          transition: "all 0.2s ease",
          ":hover": {
            transform: "scale(1.1)",
          },
        }}
        onClick={() => navigate("/")}
      />
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

        {/* {isElectron() && <NimbyController sx={{ mr: 3 }} />} */}

        <AvatarMenu />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
