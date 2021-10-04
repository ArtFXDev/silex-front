import { Box, Drawer, Grid, IconButton, Link } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useAuth } from "context";

import SilexLogo from "assets/images/silex_logo.png";

const links = [
  { text: "Home", to: "/", exact: true, needProjectId: false },
  { text: "File explorer", to: "/explorer", exact: false, needProjectId: true },
];

type MenuProps = {
  closeMenu: () => void;
  open: boolean;
};

const Menu: React.FC<MenuProps> = ({ closeMenu, open }) => {
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

          {links.map((link, i) => {
            if (
              auth.currentProjectId === undefined &&
              link.needProjectId === true
            ) {
              return;
            } else {
              return (
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
              );
            }
          })}
        </Grid>
      </Box>
    </Drawer>
  );
};

export default Menu;
