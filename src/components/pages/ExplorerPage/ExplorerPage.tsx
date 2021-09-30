import { Box, IconButton } from "@mui/material";
import {
  Switch,
  Route,
  useLocation,
  useHistory,
  Redirect,
} from "react-router-dom";
import GridViewIcon from "@mui/icons-material/GridView";
import ListIcon from "@mui/icons-material/List";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useState } from "react";

import { useAuth } from "context/AuthContext";
import { ShotsView, TasksView, AssetsView } from "./views";
import { ProjectSelector, CategorySelector } from "./selectors";

const ExplorerPage: React.FC = () => {
  const [listView, setListView] = useState<boolean>(true);

  const auth = useAuth();
  const location = useLocation();
  const locationDepth = location.pathname
    .split("/")
    .filter((e) => e.length !== 0).length;
  const history = useHistory();

  if (auth.projects && auth.projects.length === 0) {
    return <p>You don't have any projects yet...</p>;
  }

  if (location.pathname === "/explorer") {
    return <Redirect to={`/explorer/${auth.currentProjectId}/shots`} />;
  }

  return (
    <Box p={8} height="100%">
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <ProjectSelector />
        <ChevronRightIcon fontSize="large" sx={{ mx: 1 }} />
        <CategorySelector />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          float: "right",
        }}
      >
        <Box sx={{ marginLeft: "auto" }}>
          <IconButton
            onClick={() => history.goBack()}
            disabled={locationDepth <= 3}
          >
            <ChevronLeftIcon />
          </IconButton>

          <IconButton
            onClick={() => history.goForward()}
            disabled={locationDepth >= 4}
          >
            <ChevronRightIcon />
          </IconButton>

          <IconButton onClick={() => setListView(!listView)}>
            {listView ? <GridViewIcon /> : <ListIcon />}
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Switch>
          <Route path={`/explorer/:projectId/shots/:shotId`}>
            <TasksView listView={listView} />
          </Route>

          <Route path={`/explorer/:projectId/shots`}>
            <ShotsView listView={listView} />
          </Route>

          <Route path={`/explorer/:projectId/assets/:assetId`}>
            <TasksView listView={listView} />
          </Route>

          <Route path={`/explorer/:projectId/assets`}>
            <AssetsView listView={listView} />
          </Route>
        </Switch>
      </Box>
    </Box>
  );
};

export default ExplorerPage;
