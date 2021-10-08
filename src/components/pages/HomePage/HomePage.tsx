import { Typography } from "@mui/material";
import { useAuth } from "context";

import PageWrapper from "../PageWrapper/PageWrapper";

const HomePage = (): JSX.Element => {
  const auth = useAuth();
  let message = "This app is under construction...";

  if (auth.currentProjectId === undefined) {
    message = "Current project Not found";
  }

  return (
    <PageWrapper title={`Welcome ${auth.user?.full_name}`}>
      <Typography color="text.disabled">{message}</Typography>
    </PageWrapper>
  );
};

export default HomePage;
