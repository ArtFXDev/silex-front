import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CachedIcon from "@mui/icons-material/Cached";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import SortByAlphaIcon from "@mui/icons-material/SortByAlpha";
import {
  Alert,
  Box,
  Chip,
  Collapse,
  FormControlLabel,
  FormGroup,
  IconButton,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import FileOrFolderItem from "components/common/FileOrFolderItem/FileOrFolderItem";
import { ProvideFileExplorer } from "context/FileExplorerContext";
import isElectron from "is-electron";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { Task } from "types/entities";
import * as Zou from "utils/zou";

import DCCIconButton from "./DCCIconButton";
import WorkFilesView from "./WorkFilesView/WorkFilesView";

const dccButtonsData = [
  { dcc: "blender", disabled: true },
  { dcc: "houdini" },
  { dcc: "nuke" },
  { dcc: "maya" },
];

interface FileExplorerProps {
  task: Task;
}

const FileExplorer = ({ task }: FileExplorerProps): JSX.Element => {
  const [view, setView] = useState<"work" | "publish">("work");
  const [path, setPath] = useState<string>("");
  const [pathExists, setPathExists] = useState<boolean>();
  const [refreshView, setRefreshView] = useState<boolean>(false);
  const [error, setError] = useState();
  const [moreDetails, setMoreDetails] = useState<boolean>(
    window.localStorage.getItem("file-explorer-more-details") === "true"
  );
  const [sortByModificationDate, setSortByModificationDate] = useState<boolean>(
    window.localStorage.getItem("file-explorer-sort-modification-date") ===
      "true"
  );

  const { enqueueSnackbar } = useSnackbar();

  // Returns the work of publish folder depending on the view
  const getFolderFromView = useCallback(
    () => (view === "work" ? path : path.replace("work", "publish")),
    [path, view]
  );

  const updateData = () => {
    // Uses Zou to fetch the working directory for that task
    Zou.buildWorkingFilePath(task.id)
      .then((response) => {
        setPath(response.data.path);

        if (isElectron()) {
          const exists = window.electron.sendSync(
            "pathExists",
            getFolderFromView()
          ) as boolean;

          setPathExists(exists);
        }

        setRefreshView((refreshView) => !refreshView);
      })
      .catch((error) => {
        setError(error);
        enqueueSnackbar("Error when building working file path", {
          variant: "error",
        });
      });
  };

  useEffect(updateData, [enqueueSnackbar, getFolderFromView, task.id]);

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
          {/* Work / Publish button */}
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

          {/* Sort alphabetically / by modification date */}
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

          {/* Refresh button */}
          <Tooltip title="refresh" placement="top" arrow>
            <IconButton
              onClick={() => setRefreshView((refresh) => !refresh)}
              sx={{
                transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                ":hover": { transform: "rotate(180deg)" },
              }}
            >
              <CachedIcon />
            </IconButton>
          </Tooltip>

          {/* More details toggle */}
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

        {/* DCC icon buttons */}
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
              taskId={task.id}
              dcc={d.dcc}
              disabled={d.disabled}
            />
          ))}
        </Box>
      </Box>

      <Collapse in={moreDetails}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "5px",
          }}
        >
          {/* Folder path */}
          <Typography color="text.disabled" fontSize={14}>
            ⤷ {getFolderFromView()}
          </Typography>

          {/* Action button to open folder or create hierarchy */}
          {isElectron() && (
            <Tooltip
              title={pathExists ? "Open in explorer" : "Create folders"}
              placement="top"
              arrow
            >
              <IconButton
                sx={{ ml: 1 }}
                onClick={() => {
                  const folder = getFolderFromView();

                  if (pathExists) {
                    window.electron.send("openPath", folder);
                  } else {
                    window.electron.send("mkdir", folder);
                    enqueueSnackbar(`Created nested folders: ${folder}`, {
                      variant: "success",
                    });
                    updateData();
                  }
                }}
              >
                {pathExists ? (
                  <DriveFolderUploadIcon color="disabled" />
                ) : (
                  <CreateNewFolderIcon color="disabled" />
                )}
              </IconButton>
            </Tooltip>
          )}
        </div>
      </Collapse>

      <div style={{ borderRadius: 24, marginTop: 12 }}>
        {path ? (
          view === "work" ? (
            <WorkFilesView
              refresh={refreshView}
              path={path}
              sortByModificationDate={sortByModificationDate}
              moreDetails={moreDetails}
            />
          ) : (
            <ProvideFileExplorer
              moreDetails={moreDetails}
              highlightColor={task.taskType.color}
            >
              <FileOrFolderItem
                root
                refresh={refreshView}
                item={{
                  path: path.replace("work", "publish"),
                  name: "",
                  mtime: "",
                  isDirectory: true,
                  isSequence: false,
                }}
              />
            </ProvideFileExplorer>
          )
        ) : error ? (
          <Alert variant="outlined" severity={"error"}>
            Can{"'"}t build a path, make sure the path template is setup on the
            backend.
          </Alert>
        ) : undefined}
      </div>
    </>
  );
};

export default FileExplorer;
