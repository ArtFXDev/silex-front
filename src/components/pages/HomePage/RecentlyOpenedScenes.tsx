import { List, Typography } from "@mui/material";
import { RecentScenes } from "types/storage/scene";

import WorkFileItem from "~/components/pages/ExplorerPage/views/TaskModal/WorkFilesView/WorkFileItem";

const RecentlyOpenedScenes = (): JSX.Element => {
  const storedRecentScenes = window.localStorage.getItem("recent-scenes");

  const recentScenes: RecentScenes =
    storedRecentScenes && JSON.parse(storedRecentScenes);

  return (
    <div>
      <Typography sx={{ mb: 2 }}>Recently opened scenes:</Typography>

      {storedRecentScenes ? (
        <List sx={{ p: 0 }}>
          {Object.keys(recentScenes)
            .sort(
              (a, b) => recentScenes[b].lastAccess - recentScenes[a].lastAccess
            )
            .map((id) => (
              <WorkFileItem
                key={id}
                file={recentScenes[id].file}
                small
                taskId={recentScenes[id].taskId || ""}
              />
            ))}
        </List>
      ) : (
        <Typography color="text.disabled">No recent scenes...</Typography>
      )}
    </div>
  );
};

export default RecentlyOpenedScenes;
