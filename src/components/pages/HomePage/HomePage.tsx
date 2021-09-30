import { Typography } from "@mui/material";

import { useAuth } from "context";
import PageWrapper from "../PageWrapper/PageWrapper";

const HomePage: React.FC = () => {
  const auth = useAuth();

  return (
    <PageWrapper title={`Welcome ${auth.user?.full_name}`}>
      <Typography variant="h3" color="text.disabled">
        Welcome {auth.user?.full_name}!
      </Typography>

      <Typography color="text.disabled">
        This app is under construction...
      </Typography>
    </PageWrapper>
  );
};

export default HomePage;
