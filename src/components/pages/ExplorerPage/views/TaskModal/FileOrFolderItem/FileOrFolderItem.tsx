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
} from "@mui/material";
import FileIcon from "components/common/FileIcon/FileIcon";
import { uiSocket } from "context";
import isElectron from "is-electron";
import { useEffect, useState } from "react";
import { LIST_ITEM_BORDER_RADIUS } from "style/constants";
import { extensions } from "types/files/extensions";
import { FileOrFolder, ServerResponse } from "types/socket";
import { getFileExtension } from "utils/files";

import ActionButton from "./ActionButton";

interface FileOrFolderItem {
  item: FileOrFolder;
  depth: number;
  root?: boolean;
  moreDetails?: boolean;
  refresh?: boolean;
}

const FileOrFolderItem = ({
  refresh,
  root,
  item,
  depth,
  moreDetails,
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
  }, [item.isDirectory, item.path, open]);

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

  const extensionName = getFileExtension(item.name);
  const extension = extensionName ? extensions[extensionName] : undefined;

  return (
    <>
      {!root && (
        <Paper
          elevation={1}
          sx={{
            position: "relative",
            mt: 2,
            borderRadius: LIST_ITEM_BORDER_RADIUS,
          }}
        >
          <ListItemButton
            sx={{
              borderRadius: LIST_ITEM_BORDER_RADIUS,
              color: "text.secondary",
            }}
            onClick={() => {
              if (item.isDirectory) {
                setOpen(!open);
              } else {
                // Test if we can preview the file in the interface
                if (extension && extension.tags) {
                  if (extension.tags.includes("preview")) {
                    setOpenPreview(true);
                  }

                  // If in electron open the file with the os
                  if (isElectron() && extension.tags.includes("openable")) {
                    window.electron.send("openPath", item.path);
                  }
                }
              }
            }}
          >
            {/* File icon */}
            <ListItemIcon sx={{ minWidth: "50px" }}>
              <>
                {item.isDirectory ? (
                  open ? (
                    <FolderOpenIcon color="success" />
                  ) : (
                    <FolderIcon color="disabled" />
                  )
                ) : (
                  <FileIcon
                    name={extension?.software || extensionName}
                    size={25}
                    opacity={0.8}
                  />
                )}
              </>
            </ListItemIcon>

            {/* File name */}
            <ListItemText
              primaryTypographyProps={{
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {item.name}
            </ListItemText>

            {/* Action buttons */}
            {extension && (
              <ActionButton
                data={{ name: item.name, path: item.path, extension }}
              />
            )}
          </ListItemButton>
        </Paper>
      )}

      {item.isDirectory && (
        <Collapse
          in={!isLoading && open}
          sx={{
            ml: !root ? 3 : 0,
            pl: !root ? 3 : 0,
            borderLeft: !root ? "2px dashed rgba(255, 255, 255, 0.1)" : "",
          }}
        >
          {!root && (
            <Collapse in={isLoading}>
              <Fade in timeout={200}>
                <LinearProgress color="success" />
              </Fade>
            </Collapse>
          )}

          {response &&
            response.data &&
            response.data.entries.map((entry) => (
              <FileOrFolderItem
                refresh={refresh}
                moreDetails={moreDetails}
                key={entry.path}
                item={entry}
                depth={depth + 1}
              />
            ))}

          {response && response.data && response.data.entries.length === 0 && (
            <Alert variant="outlined" severity={"info"} sx={{ mt: 2 }}>
              Folder is empty
            </Alert>
          )}
        </Collapse>
      )}

      {openPreview && extension && (
        <Dialog open onClose={() => setOpenPreview(false)} fullWidth>
          <img src={`local://${item.path}`} alt={item.name} />
        </Dialog>
      )}
    </>
  );
};

export default FileOrFolderItem;
