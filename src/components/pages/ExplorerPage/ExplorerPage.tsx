import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  GridView as GridViewIcon,
  List as ListIcon,
} from "@mui/icons-material";
import { Alert, IconButton, Link } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import SearchTextField from "components/common/SearchTextField/SearchTextField";
import { useAuth } from "context";
import { useEffect, useState } from "react";
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

  const defaultCategory =
    window.localStorage.getItem("explorer-default-category") || "shots";

  const storedLastProjectId = window.localStorage.getItem("last-project-id");

  if (!storedLastProjectId) {
    window.localStorage.setItem("last-project-id", auth.currentProjectId);
  }

  const lastProjectId = storedLastProjectId;

  return (
    <PageWrapper>
      <div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <ProjectSelector />
          <ChevronRightIcon fontSize="large" sx={{ mx: 1 }} />
          <CategorySelector />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: !bigScreen ? 27 : 0,
          }}
        >
          <SearchTextField
            variant="outlined"
            placeholder="Search..."
            size="small"
            sx={{ marginLeft: bigScreen ? "auto" : "none" }}
            value={search}
            onClear={() => setSearch("")}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div>
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
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16, marginBottom: 8 }}>
        <Switch>
          {/* Redirect to the shots by default when we go to the explorer */}
          <Route exact path={`/explorer`}>
            <Redirect to={`/explorer/${lastProjectId}/${defaultCategory}`} />
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
      </div>
    </PageWrapper>
  );
};

export default ExplorerPage;
