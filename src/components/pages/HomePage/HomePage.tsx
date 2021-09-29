import { Box, Typography } from "@mui/material";

import { useAuth } from "context/AuthContext";

const HomePage: React.FC = () => {
  const auth = useAuth();

  return (
    <Box m={10}>
      <Typography variant="h3" color="text.disabled">
        Welcome {auth.user?.full_name}!
      </Typography>

      <Typography color="text.disabled">
        This app is under construction...
      </Typography>
    </Box>
  );
};

export default HomePage;
