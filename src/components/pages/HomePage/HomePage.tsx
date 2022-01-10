import { Divider, Grid } from "@mui/material";
import { useAuth } from "context";

import PageWrapper from "../PageWrapper/PageWrapper";
import ProjectsView from "./ProjectsView";
import QuickLinks from "./QuickLinks";
import RecentTasksList from "./RecentTasksList";

const HomePage = (): JSX.Element => {
  const auth = useAuth();

  return (
    <PageWrapper title={`Welcome ${auth.user?.full_name} 👋`}>
      <Divider sx={{ mb: 2.5 }} />

      <QuickLinks />

      <Grid container sx={{ mt: 3 }} spacing={3}>
        <Grid container item xs={12} spacing={3} lg={8}>
          <Grid item xs={12} md={5}>
            <ProjectsView />
          </Grid>

          <Grid item xs={7}>
            <RecentTasksList />
          </Grid>
        </Grid>
      </Grid>
    </PageWrapper>
  );
};

export default HomePage;
