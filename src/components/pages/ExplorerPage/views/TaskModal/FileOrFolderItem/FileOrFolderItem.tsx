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
import DCCLogo from "components/common/DCCLogo/DCCLogo";
import { uiSocket } from "context";
import { useEffect, useState } from "react";
import { LIST_ITEM_BORDER_RADIUS } from "style/constants";
import { FileOrFolder, ServerResponse } from "types/socket";
import { getExtensionFromName } from "utils/files";

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

      uiSocket.emit(
        "readDir",
        { path: item.path, includeHiddenFiles: moreDetails },
        (response) => {
          setResponse(response);
          setIsLoading(false);
        }
      );
    }
  }, [item.isDirectory, item.path, moreDetails, open, refresh]);

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

  const tokens = item.name.split(".");
  const hasExtension = tokens.length > 1;
  const extension = getExtensionFromName(tokens[tokens.length - 1]);

  return (
    <>
      {!root && (
        <Paper
          elevation={1}
          sx={{
            position: "relative",
            mt: 2,
            borderRadius: LIST_ITEM_BORDER_RADIUS,
            backgroundImage: `url(local://${item.path})`,
            backgroundSize: "cover",
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
                setOpenPreview(true);
              }
            }}
          >
            {/* File icon */}
            <ListItemIcon>
              <>
                {item.isDirectory ? (
                  open ? (
                    <FolderOpenIcon color="success" />
                  ) : (
                    <FolderIcon color="disabled" />
                  )
                ) : hasExtension ? (
                  <DCCLogo
                    name={extension ? extension.software : undefined}
                    size={25}
                    opacity={0.8}
                  />
                ) : null}
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
            {hasExtension && extension && (
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

      {openPreview &&
        hasExtension &&
        extension &&
        extension.tags &&
        extension.tags.includes("image") && (
          <Dialog open onClose={() => setOpenPreview(false)} fullWidth>
            <img src={`local://${item.path}`} alt={item.name} />
          </Dialog>
        )}
    </>
  );
};

export default FileOrFolderItem;
