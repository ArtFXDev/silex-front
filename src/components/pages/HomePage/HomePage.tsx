import AgricultureIcon from "@mui/icons-material/Agriculture";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import { Chip, Divider, Grid } from "@mui/material";
import { useAuth } from "context";
import { useHistory } from "react-router-dom";

import PageWrapper from "../PageWrapper/PageWrapper";
import ProjectsView from "./ProjectsView";
import RecentTasksList from "./RecentTasksList";

const HomePage = (): JSX.Element => {
  const auth = useAuth();
  const history = useHistory();

  return (
    <PageWrapper title={`Welcome ${auth.user?.full_name} 👋`}>
      <Divider sx={{ mb: 2.5 }} />

      <div style={{ display: "flex", gap: 10 }}>
        <Chip
          label="Explorer"
          variant="outlined"
          color="success"
          icon={<TravelExploreIcon />}
          onClick={() => history.push("/explorer")}
        />

        <Chip
          label="Tractor"
          variant="outlined"
          color="warning"
          icon={<AgricultureIcon />}
          onClick={() => history.push("/tractor")}
        />
      </div>

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
