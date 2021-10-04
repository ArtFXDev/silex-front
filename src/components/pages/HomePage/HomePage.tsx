import { Typography } from "@mui/material";

import { useAuth } from "context";
import PageWrapper from "../PageWrapper/PageWrapper";

const HomePage: React.FC = () => {
  const auth = useAuth();

  if (auth.currentProjectId === undefined) {
    return (
      <PageWrapper title={`Welcome ${auth.user?.full_name}`}>
        <Typography color="text.disabled">Current project Not found</Typography>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title={`Welcome ${auth.user?.full_name}`}>
      <Typography color="text.disabled">
        This app is under construction...
      </Typography>
    </PageWrapper>
  );
};

export default HomePage;
