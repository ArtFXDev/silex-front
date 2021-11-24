import CloseIcon from "@mui/icons-material/Close";
import { Box, Drawer, Grid, IconButton, Link, Typography } from "@mui/material";
import SilexLogo from "assets/images/silex_logo.png";
import OpenLogsButton from "components/common/OpenLogsButton/OpenLogsButton";
import { useAuth } from "context";
import { Link as RouterLink, useLocation } from "react-router-dom";

/**
 * List of links to display
 * TODO: should be centralized in one place?
 */
const links = [
  { text: "Home", to: "/", exact: true, needProjectId: false },
  { text: "File explorer", to: "/explorer", exact: false, needProjectId: true },
  { text: "Actions", to: "/action", exact: true },
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
            <img src={SilexLogo} alt="Silex Logo" width={100} height={100} />
          </Grid>

          {links
            .filter((link) => !(!auth.currentProjectId && link.needProjectId))
            .map((link, i) => (
              <Grid item key={i}>
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
                  {link.text}
                </Link>
              </Grid>
            ))}
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
          {process.env.REACT_APP_NAME} v{process.env.REACT_APP_VERSION}
        </Typography>

        <OpenLogsButton onClick={closeMenu} />
      </div>
    </Drawer>
  );
};

export default Menu;
