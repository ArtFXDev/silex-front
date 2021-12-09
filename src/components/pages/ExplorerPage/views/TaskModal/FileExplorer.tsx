import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SortByAlphaIcon from "@mui/icons-material/SortByAlpha";
import {
  Box,
  Chip,
  FormControlLabel,
  FormGroup,
  IconButton,
  Switch,
  Tooltip,
} from "@mui/material";
import { useState } from "react";

import DCCIconButton from "./DCCIconButton";
import PublishFilesView from "./PublishFilesView/PublishFilesView";
import WorkFilesView from "./WorkFilesView/WorkFilesView";

interface FileExplorerProps {
  taskId: string;
}

const dccButtonsData: { dcc: string; disabled?: boolean }[] = [
  { dcc: "blender", disabled: true },
  { dcc: "houdini" },
  { dcc: "nuke" },
  { dcc: "maya" },
  { dcc: "standalone" },
];

const FileExplorer = ({ taskId }: FileExplorerProps): JSX.Element => {
  const [view, setView] = useState<"work" | "publish">("work");
  const [moreDetails, setMoreDetails] = useState<boolean>(
    window.localStorage.getItem("file-explorer-more-details") === "true"
  );
  const [sortByModificationDate, setSortByModificationDate] = useState<boolean>(
    window.localStorage.getItem("file-explorer-sort-modification-date") ===
      "true"
  );

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderRadius: 5,
              px: 2,
              py: 1.4,
            }}
          >
            <Chip
              label="Work"
              color={view === "work" ? "success" : "secondary"}
              variant={view === "work" ? "filled" : "outlined"}
              sx={{ mr: 1 }}
              onClick={() => setView("work")}
            />
            <Chip
              label="Publish"
              color={view === "publish" ? "success" : "secondary"}
              variant={view === "publish" ? "filled" : "outlined"}
              onClick={() => setView("publish")}
            />
          </Box>

          <Tooltip
            title={
              sortByModificationDate
                ? "Sort by modification date"
                : "Sort by alphabetical order"
            }
            placement="top"
            arrow
          >
            <IconButton
              sx={{ ml: 1.5 }}
              onClick={() => {
                const toggle = !sortByModificationDate;
                window.localStorage.setItem(
                  "file-explorer-sort-modification-date",
                  toggle.toString()
                );
                setSortByModificationDate(toggle);
              }}
            >
              {sortByModificationDate ? (
                <AccessTimeIcon />
              ) : (
                <SortByAlphaIcon />
              )}
            </IconButton>
          </Tooltip>

          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  color="success"
                  checked={moreDetails}
                  onChange={(e) => {
                    window.localStorage.setItem(
                      "file-explorer-more-details",
                      e.target.checked.toString()
                    );
                    setMoreDetails(e.target.checked);
                  }}
                />
              }
              label="More details..."
              sx={{ ml: 2, color: "text.disabled" }}
            />
          </FormGroup>
        </div>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderRadius: 5,
            px: 1.5,
            py: 0.4,
          }}
        >
          {dccButtonsData.map((d) => (
            <DCCIconButton
              key={d.dcc}
              taskId={taskId}
              dcc={d.dcc}
              disabled={d.disabled}
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ borderRadius: 3, mt: 2.5 }}>
        {view === "work" ? (
          <WorkFilesView
            taskId={taskId}
            moreDetails={moreDetails}
            sortByModificationDate={sortByModificationDate}
          />
        ) : (
          <PublishFilesView taskId={taskId} />
        )}
      </Box>
    </>
  );
};

export default FileExplorer;
