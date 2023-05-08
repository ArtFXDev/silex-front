import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  GridView as GridViewIcon,
  List as ListIcon,
} from "@mui/icons-material";
import { Alert, IconButton, Link, SelectChangeEvent } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";
import {
  Link as RouterLink,
  Navigate,
  Route,
  Routes,
  useLocation,
  useMatch,
  useNavigate,
} from "react-router-dom";

import ProjectSelector from "~/components/common/ProjectSelector/ProjectSelector";
import SearchTextField from "~/components/common/SearchTextField/SearchTextField";
import { useAuth } from "~/context";
import { ProjectId } from "~/types/entities";

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

  const routeMatch = useMatch("/explorer/:projectId/:category/*");
  const bigScreen = useMediaQuery("(min-width:1050px)");
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const setSearchWithSave = (value: string) => {
    setSearch(value);

    // Store the search input
    if (routeMatch) {
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
    navigate(`/${sp[1]}/${e.target.value}/${sp[3]}`);
  };

  useEffect(() => {
    if (routeMatch) {
      setSelectedProject(routeMatch.params.projectId);
    }
  }, [routeMatch]);

  useEffect(() => {
    // Restore the search input depending on the category
    if (routeMatch && routeMatch.params.category && search === undefined) {
      const savedSearch = window.localStorage.getItem(
        `explorer-${routeMatch.params.category}-search`
      );
      setSearch(savedSearch || "");
    }
  }, [routeMatch, search]);

  useEffect(() => {
    // Clear the search input on route change
    const newDepth = location.pathname.split("/").length - 1;
    setSearch(newDepth === 3 ? undefined : "");
  }, [location]);

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

  // Redirect to the current project explorer page
  if (!routeMatch) {
    return <Navigate to={`${storedLastProjectId}/${defaultCategory}`} />;
  }

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

          <div style={{ display: "flex" }}>
            <IconButton
              onClick={() => navigate(-1)}
              // disabled={locationDepth <= 3}
            >
              <ChevronLeftIcon />
            </IconButton>

            <IconButton
              onClick={() => navigate(1)}
              // disabled={locationDepth >= 4}
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
        <Routes>
          <Route path=":projectId">
            <Route
              path="shots"
              element={<ShotsView listView={listView} search={search || ""} />}
            />

            <Route
              path="assets"
              element={<AssetsView listView={listView} search={search || ""} />}
            />

            <Route
              path=":category/:entityId/tasks/*"
              element={<TasksView listView={listView} search={search || ""} />}
            />

            <Route
              path=""
              element={
                <Alert variant="outlined" color="error" sx={{ mt: 2 }}>
                  <div>
                    Invalid route,{" "}
                    <Link component={RouterLink} to="/explorer">
                      go home
                    </Link>
                  </div>
                </Alert>
              }
            />
          </Route>
        </Routes>
      </div>
    </PageWrapper>
  );
};

export default ExplorerPage;
