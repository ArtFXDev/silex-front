import { Box, List, LinearProgress } from "@mui/material";
import { useLocation } from "react-router-dom";
import useSWRImmutable from "swr";

import { useAuth } from "context/AuthContext";
import { lastElementOf } from "utils/array";
import LinkListItem from "./LinkListItem";
import { fetchMultiple } from "./utils";

/**
 * API url templates depending on the depth
 */
const urls = [
  "data/projects/{id}/sequences",
  "data/sequences/{id}/shots",
  "data/shots/{id}/tasks",
];

interface ListViewProps {
  /** The depth of the view (sq -> shot -> task) */
  depth: number;

  /** The id of the selected item */
  selectedId: string | undefined;
  /** Sets the selected id */
  setSelectedId: (id: string) => void;

  /** Wether or not we want to display it as a list or grid */
  listView: boolean;
}

const ListView: React.FC<ListViewProps> = ({
  depth,
  selectedId,
  setSelectedId,
  listView,
}) => {
  const auth = useAuth();
  const currentProjectId = auth.currentProjectId as string;
  const location = useLocation();

  // The current entity id
  const currentId =
    depth === 0
      ? currentProjectId
      : lastElementOf(
          location.pathname.split("/").filter((e) => e.length !== 0)
        );
  const urlKey = urls[depth].replace("{id}", currentId);

  // Sequences, shots or tasks are not supposed to change, we use immutable
  const { data } = useSWRImmutable(urlKey, fetchMultiple);

  return (
    <Box>
      {data ? (
        listView ? (
          <List>
            {data.map((e, i) => (
              <LinkListItem
                index={i}
                entity={e}
                key={e.id}
                selected={e.id === selectedId}
                selectCurrent={() => setSelectedId(e.id)}
                listView={listView}
              />
            ))}
          </List>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            {data.map((e, i) => (
              <LinkListItem
                index={i}
                entity={e}
                key={e.id}
                selected={e.id === selectedId}
                selectCurrent={() => setSelectedId(e.id)}
                listView={listView}
              />
            ))}
          </Box>
        )
      ) : (
        <LinearProgress />
      )}
    </Box>
  );
};

export default ListView;
