import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  GridView as GridViewIcon,
  List as ListIcon,
} from "@mui/icons-material";
import { Alert, Box, IconButton, Link } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import SearchTextField from "components/common/SearchTextField/SearchTextField";
import { useAuth } from "context";
import { useCallback, useEffect, useState } from "react";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

import PageWrapper from "../PageWrapper/PageWrapper";
import { CategorySelector, ProjectSelector } from "./selectors";
import { AssetsView, ShotsView, TasksView } from "./views";

const ExplorerPage = (): JSX.Element => {
  const [listView, setListView] = useState<boolean>(
    window.localStorage.getItem("list-view") === "true"
  );
  const [search, setSearch] = useState<string>("");

  const bigScreen = useMediaQuery("(min-width:1050px)");
  const auth = useAuth();
  const location = useLocation();
  const locationDepth = location.pathname
    .split("/")
    .filter((e) => e.length !== 0).length;
  const history = useHistory();

  const handleSearchInput = useCallback((e) => setSearch(e.target.value), []);

  useEffect(() => {
    // Clear the search input on route change
    const unlisten = history.listen(() => {
      setSearch("");
    });

    return () => unlisten();
  }, [history]);

  if (!auth.currentProjectId) {
    return <PageWrapper>Loading project...</PageWrapper>;
  }

  if (auth.projects && auth.projects.length === 0) {
    return <PageWrapper>You don{"'"}t have any projects yet...</PageWrapper>;
  }

  return (
    <PageWrapper>
      <Box>
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
            mt: !bigScreen ? 3 : 0,
          }}
        >
          <SearchTextField
            variant="outlined"
            placeholder="Search..."
            size="small"
            sx={{ mr: 3, marginLeft: bigScreen ? "auto" : "none" }}
            value={search}
            onChange={handleSearchInput}
          />

          <Box>
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

            <IconButton
              onClick={() => {
                window.localStorage.setItem(
                  "list-view",
                  (!listView).toString()
                );
                setListView(!listView);
              }}
            >
              {listView ? <GridViewIcon /> : <ListIcon />}
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: 2, mb: 1 }}>
        <Switch>
          {/* Redirect to the shots by default when we go to the explorer */}
          <Route exact path={`/explorer`}>
            <Redirect to={`/explorer/${auth.currentProjectId}/shots`} />
          </Route>

          <Switch>
            <Route path={`/explorer/:projectId/:category/:entityId/tasks`}>
              <TasksView listView={listView} search={search} />
            </Route>

            <Route path={`/explorer/:projectId/shots`}>
              <ShotsView listView={listView} search={search} />
            </Route>

            <Route path={`/explorer/:projectId/assets`}>
              <AssetsView listView={listView} search={search} />
            </Route>

            <Route>
              <Alert variant="outlined" color="error" sx={{ mt: 2 }}>
                <div>
                  Invalid route,{" "}
                  <Link component={RouterLink} to="/explorer">
                    go home
                  </Link>
                </div>
              </Alert>
            </Route>
          </Switch>
        </Switch>
      </Box>
    </PageWrapper>
  );
};

export default ExplorerPage;
