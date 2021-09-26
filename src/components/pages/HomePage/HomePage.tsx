import { Box, Typography } from "@mui/material";

import { useAuth } from "context";
import PageWrapper from "../PageWrapper/PageWrapper";

const HomePage: React.FC = () => {
  const auth = useAuth();

  return (
    <PageWrapper title={`Welcome ${auth.user?.fullName()}`}>
      <Typography color="text.disabled">
        This app is under construction...
      </Typography>
    </PageWrapper>
  );
};

export default HomePage;
