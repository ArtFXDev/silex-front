import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import SortByAlphaIcon from "@mui/icons-material/SortByAlpha";
import {
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
import isElectron from "is-electron";
import { useEffect, useState } from "react";
import * as Zou from "utils/zou";

import DCCIconButton from "./DCCIconButton";
import FileOrFolderItem from "./FileOrFolderItem";
import WorkFilesView from "./WorkFilesView/WorkFilesView";

interface FileExplorerProps {
  taskId: string;
}

const dccButtonsData = [
  { dcc: "blender", disabled: true },
  { dcc: "houdini" },
  { dcc: "nuke" },
  { dcc: "maya" },
];

const FileExplorer = ({ taskId }: FileExplorerProps): JSX.Element => {
  const [view, setView] = useState<"work" | "publish">("work");
  const [path, setPath] = useState<string>();
  const [moreDetails, setMoreDetails] = useState<boolean>(
    window.localStorage.getItem("file-explorer-more-details") === "true"
  );
  const [sortByModificationDate, setSortByModificationDate] = useState<boolean>(
    window.localStorage.getItem("file-explorer-sort-modification-date") ===
      "true"
  );

  useEffect(() => {
    Zou.buildWorkingFilePath(taskId).then((response) => {
      setPath(response.data.path);
    });
  }, [taskId]);

  const changeView = (newView: "work" | "publish") => {
    setView(newView);
  };

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
              onClick={() => changeView("work")}
            />
            <Chip
              label="Publish"
              color={view === "publish" ? "success" : "secondary"}
              variant={view === "publish" ? "filled" : "outlined"}
              onClick={() => changeView("publish")}
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

      <Collapse in={moreDetails}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "5px",
          }}
        >
          <Typography color="text.disabled" fontSize={14} mt={0.7}>
            ⤷{" "}
            {path && (view === "work" ? path : path.replace("work", "publish"))}
          </Typography>

          {isElectron() && (
            <Tooltip title="Open in explorer" placement="top" arrow>
              <IconButton
                sx={{ ml: 1 }}
                onClick={() =>
                  window.electron.send(
                    "openFolderOrFile",
                    path?.replace("work", "publish")
                  )
                }
              >
                <DriveFolderUploadIcon color="disabled" />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </Collapse>

      <Box sx={{ borderRadius: 3, mt: 1.5 }}>
        {path &&
          (view === "work" ? (
            <WorkFilesView
              path={path}
              sortByModificationDate={sortByModificationDate}
              moreDetails={moreDetails}
            />
          ) : (
            <FileOrFolderItem
              moreDetails={moreDetails}
              item={{
                path: path.replace("work", "publish"),
                name: "",
                mtime: "",
                isDirectory: true,
              }}
              root
              depth={0}
            />
          ))}
      </Box>
    </>
  );
};

export default FileExplorer;
