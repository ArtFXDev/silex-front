import { Box, IconButton } from "@mui/material";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  GridView as GridViewIcon,
  List as ListIcon,
} from "@mui/icons-material";
import { useState } from "react";

import { useAuth } from "context";
import { AssetsView, ShotsView, TasksView } from "./views";
import { CategorySelector, ProjectSelector } from "./selectors";

const ExplorerPage = (): JSX.Element => {
  const [listView, setListView] = useState<boolean>(true);

  const auth = useAuth();
  const location = useLocation();
  const locationDepth = location.pathname
    .split("/")
    .filter((e) => e.length !== 0).length;
  const history = useHistory();

  if (auth.projects && auth.projects.length === 0) {
    return <p>You don{"'"}t have any projects yet...</p>;
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
          {/* Redirect to the shots by default when we go to the explorer */}
          <Route exact path={`/explorer`}>
            <Redirect to={`/explorer/${auth.currentProjectId}/shots`} />
          </Route>

          <Switch>
            <Route path={`/explorer/:projectId/:category/:entityId/tasks`}>
              <TasksView listView={listView} />
            </Route>

            <Route path={`/explorer/:projectId/shots`}>
              <ShotsView listView={listView} />
            </Route>

            <Route path={`/explorer/:projectId/assets`}>
              <AssetsView listView={listView} />
            </Route>
          </Switch>
        </Switch>
      </Box>
    </Box>
  );
};

export default ExplorerPage;
