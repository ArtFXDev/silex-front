import { Box, Drawer, Grid, IconButton, Link } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Link as RouterLink, useLocation } from "react-router-dom";

import SilexLogo from "assets/images/silex_logo.png";

const links = [
  { text: "Home", to: "/" },
  { text: "File explorer", to: "/explorer" },
];

type MenuProps = {
  closeMenu: () => void;
  open: boolean;
};

const Menu: React.FC<MenuProps> = ({ closeMenu, open }) => {
  const location = useLocation();

  return (
    <Drawer anchor="left" elevation={12} open={open} onClose={closeMenu}>
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

          {links.map((link, i) => (
            <Grid item key={i}>
              <Link
                component={RouterLink}
                to={link.to}
                underline="hover"
                color={
                  link.to === location.pathname ? "primary" : "text.disabled"
                }
                onClick={closeMenu}
              >
                {link.text}
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Drawer>
  );
};

export default Menu;
