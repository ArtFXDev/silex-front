import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import {
  Alert,
  Collapse,
  Fade,
  IconButton,
  LinearProgress,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import DCCLogo from "components/common/DCCLogo/DCCLogo";
import { uiSocket } from "context";
import { useEffect, useState } from "react";
import { LIST_ITEM_BORDER_RADIUS } from "style/constants";
import { FileOrFolder, ServerResponse } from "types/socket";
import { formatDateTime } from "utils/date";
import { extensionToDCCName } from "utils/files";

interface FileOrFolderItem {
  item: FileOrFolder;
  depth: number;
  root?: boolean;
  moreDetails?: boolean;
}

const FileOrFolderItem = ({
  root,
  item,
  depth,
  moreDetails,
}: FileOrFolderItem): JSX.Element => {
  const [open, setOpen] = useState<boolean>(depth < 2);
  const [response, setResponse] =
    useState<ServerResponse<{ entries: FileOrFolder[] }>>();

  useEffect(() => {
    if (item.isDirectory && open) {
      uiSocket.emit("readDir", { path: item.path }, (response) => {
        setResponse(response);
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

  const extension = item.name.split(".")[1];
  const dcc = extensionToDCCName(extension);

  /*  const pullSceneIntoWork = () => {
    uiSocket.emit(
      "pullPublishedScene",
      { taskId, publishedFilePath: item.path },
      (response) => {
        if (response.status === 200) {
          enqueueSnackbar(`Copied publish file ${filename} into work!`, {
            variant: "success",
          });
        } else {
          enqueueSnackbar(`Pull ${filename} failed: ${response.msg}`, {
            variant: "error",
          });
        }
      }
    );
  }; */

  return (
    <>
      {!root && (
        <Paper
          elevation={1}
          sx={{ mt: 2, borderRadius: LIST_ITEM_BORDER_RADIUS }}
        >
          <ListItemButton
            sx={{
              borderRadius: LIST_ITEM_BORDER_RADIUS,
              color: "text.secondary",
            }}
            onClick={() => setOpen(!open)}
          >
            <ListItemIcon>
              {item.isDirectory ? (
                open ? (
                  <FolderOpenIcon color="success" />
                ) : (
                  <FolderIcon color="disabled" />
                )
              ) : (
                <DCCLogo
                  name={extensionToDCCName(extension)}
                  size={25}
                  opacity={0.8}
                />
              )}
            </ListItemIcon>

            <ListItemText>{item.name}</ListItemText>

            {moreDetails && (
              <Typography color="text.disabled" fontSize={13}>
                Last modif: {formatDateTime(item.mtime)}
              </Typography>
            )}

            {dcc && (
              <ListItemIcon>
                <Tooltip title="pull in work" placement="top" arrow>
                  <IconButton>
                    <CloudDownloadIcon color="info" />
                  </IconButton>
                </Tooltip>
              </ListItemIcon>
            )}
          </ListItemButton>
        </Paper>
      )}

      {item.isDirectory && (
        <Collapse
          in={open}
          sx={{
            ml: !root ? 3 : 0,
            pl: !root ? 3 : 0,
            borderLeft: !root ? "2px dashed rgba(255, 255, 255, 0.1)" : "",
          }}
        >
          {!root && (
            <Collapse in={!response}>
              <Fade in timeout={200}>
                <LinearProgress color="success" />
              </Fade>
            </Collapse>
          )}

          {response &&
            response.data &&
            response.data.entries.map((entry) => (
              <FileOrFolderItem
                moreDetails={moreDetails}
                key={entry.path}
                item={entry}
                depth={depth + 1}
              />
            ))}
        </Collapse>
      )}
    </>
  );
};

export default FileOrFolderItem;
