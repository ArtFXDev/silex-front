import { Divider, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useAuth } from "context";

import PageWrapper from "../PageWrapper/PageWrapper";
import ProjectsView from "./ProjectsView";
import QuickLinks from "./QuickLinks";
import RecentlyOpenedScenes from "./RecentlyOpenedScenes";
import RecentTasksList from "./RecentTasksList";

const HomePage = (): JSX.Element => {
  const auth = useAuth();
  const theme = useTheme();
  const mdBreakPoint = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <PageWrapper title={`Welcome ${auth.user?.full_name} 👋`}>
      <Divider sx={{ mb: 2.5 }} />

      <QuickLinks />

      <Grid container sx={{ mt: 3 }} spacing={3}>
        <Grid container item xs={12} spacing={3}>
          <Grid item xs={5} md={3}>
            <ProjectsView />
          </Grid>

          <Grid item xs={7} md={5}>
            <RecentTasksList />
            {!mdBreakPoint && (
              <>
                <br />
                <RecentlyOpenedScenes />{" "}
              </>
            )}
          </Grid>

          {mdBreakPoint && (
            <Grid item md={4}>
              <RecentlyOpenedScenes />
            </Grid>
          )}
        </Grid>
      </Grid>
    </PageWrapper>
  );
};

export default HomePage;
