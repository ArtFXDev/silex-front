import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  GridView as GridViewIcon,
  List as ListIcon,
} from "@mui/icons-material";
import { Alert, IconButton, Link, SelectChangeEvent } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import ProjectSelector from "components/common/ProjectSelector/ProjectSelector";
import SearchTextField from "components/common/SearchTextField/SearchTextField";
import { useAuth } from "context";
import { useEffect, useState } from "react";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
  useRouteMatch,
} from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { ProjectId } from "types/entities";

import PageWrapper from "../PageWrapper/PageWrapper";
import CategorySelector from "./CategorySelector";
import ProjectSettings from "./ProjectSettings";
import { AssetsView, ShotsView, TasksView } from "./views";

const ExplorerPage = (): JSX.Element => {
  const [selectedProject, setSelectedProject] = useState<ProjectId>();
  const [search, setSearch] = useState<string>();
  const [listView, setListView] = useState<boolean>(
    window.localStorage.getItem("list-view") === "true"
  );

  const routeMatch = useRouteMatch<{ projectId: string; category: string }>(
    "/explorer/:projectId/:category"
  );

  const bigScreen = useMediaQuery("(min-width:1050px)");
  const auth = useAuth();
  const location = useLocation();
  const history = useHistory();
  const locationDepth = location.pathname.split("/").length - 1;

  useEffect(() => {
    if (routeMatch) {
      setSelectedProject(routeMatch.params.projectId);
    }
  }, [routeMatch]);

  const setSearchWithSave = (value: string) => {
    setSearch(value);

    // Store the search input
    if (locationDepth === 3 && routeMatch) {
      window.localStorage.setItem(
        `explorer-${routeMatch.params.category}-search`,
        value
      );
    }
  };

  const handleProjectChange = (e: SelectChangeEvent<string>) => {
    auth.setCurrentProjectId(e.target.value);

    setSelectedProject(e.target.value);
    window.localStorage.setItem("last-project-id", e.target.value);

    const sp = location.pathname.split("/");
    history.push(`/${sp[1]}/${e.target.value}/${sp[3]}`);
  };

  useEffect(() => {
    // Restore the search input depending on the category
    if (
      routeMatch &&
      routeMatch.params.category &&
      search === undefined &&
      locationDepth === 3
    ) {
      const savedSearch = window.localStorage.getItem(
        `explorer-${routeMatch.params.category}-search`
      );
      setSearch(savedSearch || "");
    }
  }, [locationDepth, routeMatch, search]);

  useEffect(() => {
    // Clear the search input on route change
    const unlisten = history.listen((newLocation) => {
      const newDepth = newLocation.pathname.split("/").length - 1;
      setSearch(newDepth === 3 ? undefined : "");
    });

    return () => unlisten();
  }, [history, locationDepth, routeMatch]);

  if (!auth.currentProjectId) {
    return <PageWrapper>Loading project...</PageWrapper>;
  }

  if (auth.projects && auth.projects.length === 0) {
    return <PageWrapper>You don{"'"}t have any projects yet...</PageWrapper>;
  }

  // We save the shots / assets category
  const defaultCategory =
    window.localStorage.getItem("explorer-default-category") || "shots";

  // Use the stored last project id if exists
  const storedLastProjectId = window.localStorage.getItem("last-project-id");
  if (!storedLastProjectId) {
    window.localStorage.setItem("last-project-id", auth.currentProjectId);
  }

  const lastProjectId = storedLastProjectId;

  return (
    <PageWrapper>
      <div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <ProjectSelector
            value={selectedProject}
            onChange={handleProjectChange}
          />
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
            value={search || ""}
            onClear={() => setSearchWithSave("")}
            onChange={(e) => setSearchWithSave(e.target.value)}
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

            <ProjectSettings project={selectedProject} />
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
              <TasksView listView={listView} search={search || ""} />
            </Route>

            <Route path={`/explorer/:projectId/shots`}>
              <ShotsView listView={listView} search={search || ""} />
            </Route>

            <Route path={`/explorer/:projectId/assets`}>
              <AssetsView listView={listView} search={search || ""} />
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
