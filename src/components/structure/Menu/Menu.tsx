import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Box,
  Drawer,
  Grid,
  IconButton,
  Link,
  Tooltip,
  Typography,
} from "@mui/material";
import isElectron from "is-electron";
import { Link as RouterLink, useLocation } from "react-router-dom";

import ProdBadge from "~/components/common/chips/ProdBetaDevChip";
import OpenLogsButton from "~/components/common/OpenLogsButton/OpenLogsButton";
import SilexLogo from "~/components/common/SilexLogo/SilexLogo";
import { useAction, useAuth } from "~/context";

/**
 * List of links to display
 * TODO: should be centralized in one place?
 */
const links = [
  { text: "Home", to: "/", exact: true, needProjectId: false },
  {
    text: "Project explorer",
    to: "/explorer",
    exact: false,
    needProjectId: true,
  },
  { text: "Actions", to: "/action", exact: true },
  { text: "Statistics", to: "/stats", exact: true },
  {
    text: "🚜 Tractor",
    to: "/tractor",
    exact: true,
    openInNewWindow: true,
    openTo: import.meta.env.VITE_TRACTOR_URL,
  },
  {
    text: "👨‍🌾 Harvest",
    to: "/harvest",
    exact: true,
    openInNewWindow: true,
    openTo: import.meta.env.VITE_HARVEST_URL,
  },
  {
    text: "Ticket",
    to: "/ticket",
    exact: true,
    openInNewWindow: true,
    openTo: import.meta.env.VITE_TICKET_URL,
  },
];

interface MenuProps {
  closeMenu: () => void;
  open: boolean;
}

/**
 * Menu component with links pointing to the different pages
 */
const Menu = ({ closeMenu, open }: MenuProps): JSX.Element => {
  const location = useLocation();
  const auth = useAuth();
  const { actions } = useAction();

  return (
    <Drawer anchor="left" elevation={2} open={open} onClose={closeMenu}>
      <IconButton
        sx={{ position: "absolute", top: 0, right: 0, m: 1 }}
        onClick={closeMenu}
      >
        <CloseIcon color="disabled" />
      </IconButton>

      <Box
        sx={{
          width: 250,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid
          container
          spacing={3}
          alignItems="center"
          flexDirection="column"
          sx={{
            mt: 2,
          }}
        >
          <Grid item sx={{ mb: 2 }}>
            <SilexLogo size={100} />
          </Grid>

          <Grid
            item
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            {links
              .filter((link) => !(!auth.currentProjectId && link.needProjectId))
              .map((link, i) => (
                <div
                  style={{
                    padding: "15px 0",
                    display: "flex",
                    alignItems: "center",
                  }}
                  key={i}
                >
                  <Link
                    component={RouterLink}
                    to={link.to}
                    underline="hover"
                    color={
                      (
                        link.exact
                          ? location.pathname === link.to
                          : location.pathname.startsWith(link.to)
                      )
                        ? "primary"
                        : "text.disabled"
                    }
                    onClick={closeMenu}
                  >
                    {link.text === "Actions"
                      ? `Actions (${Object.keys(actions).length})`
                      : link.text}
                  </Link>

                  {/* Open in new window button */}
                  {link.openInNewWindow && isElectron() && (
                    <Tooltip title="New window" placement="top" arrow>
                      <OpenInNewIcon
                        onClick={() => window.open(link.openTo)}
                        sx={{
                          ml: 1.5,
                          transition: "all 0.2s ease",
                          cursor: "pointer",
                          "&:hover": { color: "rgb(166, 166, 166)" },
                        }}
                        color="disabled"
                        fontSize="small"
                      />
                    </Tooltip>
                  )}
                </div>
              ))}
          </Grid>
        </Grid>
      </Box>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          margin: "10px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography sx={{ color: "rgba(150, 149, 149, 0.5)" }} fontSize={12}>
          {import.meta.env.VITE_APP_NAME} v{import.meta.env.VITE_APP_VERSION}
        </Typography>

        <div style={{ marginLeft: "10px" }}>
          <ProdBadge />
        </div>

        <OpenLogsButton onClick={closeMenu} />

        <IconButton component={RouterLink} to="/settings" onClick={closeMenu}>
          <SettingsIcon color="disabled" />
        </IconButton>
      </div>
    </Drawer>
  );
};

export default Menu;
