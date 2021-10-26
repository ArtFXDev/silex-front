import { Typography } from "@mui/material";
import { useAuth } from "context";

import PageWrapper from "../PageWrapper/PageWrapper";

const HomePage = (): JSX.Element => {
  const auth = useAuth();

  return (
    <PageWrapper title={`Welcome ${auth.user?.full_name}`}>
      <Typography color="text.disabled">Home page coming soon...</Typography>
    </PageWrapper>
  );
};

export default HomePage;
