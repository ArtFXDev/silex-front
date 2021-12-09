import { Divider, Stack } from "@mui/material";
import { useAuth } from "context";

import PageWrapper from "../PageWrapper/PageWrapper";
import ProjectsView from "./ProjectsView";
import RecentTasksList from "./RecentTasksList";

const HomePage = (): JSX.Element => {
  const auth = useAuth();

  return (
    <PageWrapper title={`Welcome ${auth.user?.full_name}`}>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={5}
        sx={{ mt: 4 }}
      >
        <ProjectsView />

        <RecentTasksList />
      </Stack>
    </PageWrapper>
  );
};

export default HomePage;
