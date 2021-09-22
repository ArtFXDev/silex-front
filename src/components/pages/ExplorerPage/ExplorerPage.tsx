import { Box, Grid, Link, Breadcrumbs, IconButton } from "@mui/material";
import {
  useLocation,
  useRouteMatch,
  useHistory,
  Link as RouterLink,
} from "react-router-dom";
import GridViewIcon from "@mui/icons-material/GridView";
import ListIcon from "@mui/icons-material/List";
import { useState, useEffect } from "react";

import ListView from "./ListView";
import DetailsView from "./DetailsView";

const ExplorerPage: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>();
  const [listView, setListView] = useState<boolean>(true);

  const location = useLocation();
  const history = useHistory();
  const routeMatch = useRouteMatch();

  // Listen tou route change at component mount in order to reset the selected list item
  useEffect(() => {
    history.listen((_location, _action) => setSelectedId(undefined));
  }, [history]);

  /**
   * Returns the route items for the breadcrumb
   */
  const getItemsFromLocation = (location: string) => {
    return location
      .split(routeMatch.url)[1]
      .split("/")
      .filter((e) => e.length !== 0);
  };

  const breadCrumbItems = getItemsFromLocation(location.pathname);

  return (
    <Box p={10} height="100%">
      <Grid container sx={{ columnGap: 2 }}>
        <Grid item xs={5}>
          <Breadcrumbs aria-label="breadcrumb">
            <p></p>
            <p>Sequences</p>
            {breadCrumbItems.map((e, i) => (
              <Link
                component={RouterLink}
                to={"."}
                key={i}
                color="text.disabled"
              >
                {e.toUpperCase()}
              </Link>
            ))}
          </Breadcrumbs>

          <IconButton onClick={() => setListView(!listView)}>
            {listView ? <GridViewIcon /> : <ListIcon />}
          </IconButton>

          <ListView
            depth={breadCrumbItems.length}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            listView={listView}
          />
        </Grid>

        <Grid item xs={1}>
          <Box
            component="hr"
            sx={{
              backgroundColor: "text.disabled",
              width: "5px",
              height: "100%",
              borderRadius: "2px",
              opacity: "30%",
            }}
          />
        </Grid>

        <Grid item xs={5}>
          <DetailsView depth={breadCrumbItems.length} selectedId={selectedId} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExplorerPage;
