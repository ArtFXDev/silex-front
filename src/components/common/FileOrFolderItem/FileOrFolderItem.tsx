import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import {
  Alert,
  Collapse,
  Dialog,
  Fade,
  LinearProgress,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import FileIcon from "components/common/FileIcon/FileIcon";
import { uiSocket } from "context";
import isElectron from "is-electron";
import { useEffect, useState } from "react";
import { LIST_ITEM_BORDER_RADIUS } from "style/constants";
import { extensions } from "types/files/extensions";
import { FileOrFolder, ServerResponse } from "types/socket";
import { formatDateTime } from "utils/date";
import { fileMatchExtensions, getFileExtension } from "utils/files";

import ActionButton from "./ActionButton";

const SCROLL_OPTIONS: ScrollIntoViewOptions = {
  behavior: "smooth",
  block: "center",
  inline: "nearest",
};

interface FileOrFolderItem {
  item: FileOrFolder;

  /** Tracks the depth of the file/folder, useful to open at a certain depth by default */
  depth?: number;

  /** When it's the top level folder, don't display the parent folder */
  root?: boolean;

  /** Display the modification time */
  moreDetails?: boolean;

  /** Boolean value to switch when we need to refresh the view. */
  refresh?: boolean;

  /** Use a compact display for the file hierarchy */
  small?: boolean;

  /** Callback to register when the user click on a file */
  onFileSelect?: (filePath: string) => void;

  /** The selected file path */
  selectedFiles?: string[];

  /** List of extensions to filter */
  filterExtensions?: string[];
}

const FileOrFolderItem = ({
  refresh,
  root,
  item,
  depth = 0,
  moreDetails,
  small,
  onFileSelect,
  selectedFiles,
  filterExtensions,
}: FileOrFolderItem): JSX.Element => {
  const [open, setOpen] = useState<boolean>(depth < 2);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] =
    useState<ServerResponse<{ entries: FileOrFolder[] }>>();

  const [openPreview, setOpenPreview] = useState<boolean>();

  useEffect(() => {
    if (item.isDirectory && open) {
      setIsLoading(true);

      uiSocket.emit("readDir", { path: item.path }, (response) => {
        setResponse(response);
        setIsLoading(false);
      });
    }
  }, [item.isDirectory, item.path, open, refresh]);

  if (response && response.status !== 200) {
    return (
      <Alert
        variant="outlined"
        severity={response.status === 404 ? "info" : "warning"}
        sx={{ my: 1 }}
      >
        {response.msg}
      </Alert>
    );
  }

  // Called when clicking on the item (file or directory)
  const onItemClick = () => {
    if (item.isDirectory) {
      // Scroll that element so it's centered
      if (!open && !small) {
        const scrollToItem = () =>
          document.getElementById(id)?.scrollIntoView(SCROLL_OPTIONS);

        setTimeout(scrollToItem, 200);
      }

      setOpen(!open);
    } else {
      if (onFileSelect) {
        // Select the file when in select mode
        onFileSelect(item.path);
      } else {
        if (extension && extension.tags && isElectron()) {
          // Test if we can preview the file in the interface
          if (extension.tags.includes("preview")) {
            setOpenPreview(true);
          }

          // If in electron open the file with the os
          if (extension.tags.includes("openable")) {
            window.electron.send("openPath", item.path);
          }
        }
      }
    }
  };

  // A unique id identifying the file
  // Used for scrolling to the selected div
  const id = `file-${item.name}-${item.mtime}`;

  const extensionName = getFileExtension(item.name);
  const extension = extensionName ? extensions[extensionName] : undefined;

  const isSelected = selectedFiles?.includes(item.path);

  const filteredChildren =
    response &&
    response.data &&
    response.data.entries.filter(
      (e) => e.isDirectory || fileMatchExtensions(e.path, filterExtensions)
    );

  return (
    <>
      {!root && (
        <Paper
          id={id}
          elevation={1}
          sx={{
            position: "relative",
            mt: 2,
            borderRadius: LIST_ITEM_BORDER_RADIUS,
            boxShadow: isSelected
              ? `inset 0 0 0 2px rgba(98, 198, 115, 0.5)`
              : "",
            backgroundColor: isSelected ? "rgba(98, 198, 115, 0.1)" : "",
          }}
        >
          <ListItemButton
            onClick={onItemClick}
            sx={{
              borderRadius: LIST_ITEM_BORDER_RADIUS,
              color: "text.secondary",
              py: small ? 0.5 : 1,
            }}
          >
            {/* File icon */}
            <ListItemIcon sx={{ minWidth: small ? "35px" : "50px" }}>
              <>
                {item.isDirectory ? (
                  open ? (
                    <FolderOpenIcon
                      color="success"
                      fontSize={small ? "small" : "medium"}
                    />
                  ) : (
                    <FolderIcon
                      color="disabled"
                      fontSize={small ? "small" : "medium"}
                    />
                  )
                ) : (
                  <FileIcon
                    name={extension?.software || extensionName}
                    size={small ? 18 : 25}
                    opacity={0.8}
                  />
                )}
              </>
            </ListItemIcon>

            {/* File name */}
            <ListItemText
              primaryTypographyProps={{
                fontSize: small ? 14 : 16,
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {item.name}
            </ListItemText>

            {/* Modification time */}
            {moreDetails && (
              <Typography color="text.disabled" fontSize={13} mr={1}>
                Last modif: {formatDateTime(item.mtime)}
              </Typography>
            )}

            {/* Action buttons (not in file select mode) */}
            {!onFileSelect && extension && (
              <ActionButton
                data={{ name: item.name, path: item.path, extension }}
              />
            )}
          </ListItemButton>
        </Paper>
      )}

      {item.isDirectory && (
        <Collapse
          in={(!isLoading && open) || root}
          timeout={depth <= 1 ? 0 : "auto"}
          sx={{
            ml: !root ? (small ? 2 : 3) : 0,
            pl: !root ? (small ? 2 : 3) : 0,
            borderLeft: !root ? "2px dashed rgba(255, 255, 255, 0.1)" : "",
          }}
        >
          {/* Loading bar */}
          {!root && (
            <Collapse in={isLoading} unmountOnExit>
              <Fade in timeout={200}>
                <LinearProgress color="success" />
              </Fade>
            </Collapse>
          )}

          {/* Display children */}
          {filteredChildren &&
            filteredChildren.map((entry) => (
              <FileOrFolderItem
                onFileSelect={onFileSelect}
                selectedFiles={selectedFiles}
                small={small}
                refresh={refresh}
                moreDetails={moreDetails}
                key={entry.path}
                item={entry}
                depth={depth + 1}
                filterExtensions={filterExtensions}
              />
            ))}

          {filteredChildren && filteredChildren.length === 0 && (
            <Alert
              variant="outlined"
              severity={"info"}
              sx={{ mt: 2, py: small ? 0 : 1 }}
            >
              {filterExtensions && filterExtensions.length > 0
                ? "No matching files in this folder"
                : "Folder is empty"}
            </Alert>
          )}
        </Collapse>
      )}

      {openPreview && extension && (
        <Dialog open onClose={() => setOpenPreview(false)} fullWidth>
          {/* Use local file protocol defined in Electron */}
          <img src={`local://${item.path}`} alt={item.name} />
        </Dialog>
      )}
    </>
  );
};

export default FileOrFolderItem;
