import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import {
  Collapse,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";
import DCCLogo from "components/common/DCCLogo/DCCLogo";
import { useState } from "react";
import { LIST_ITEM_BORDER_RADIUS } from "style/constants";
import { FileOrFolder } from "types/socket";
import { extensionToDCCName } from "utils/files";

interface FileOrFolderItem {
  item: FileOrFolder;
  depth: number;
}

const FileOrFolderItem = ({ item, depth }: FileOrFolderItem): JSX.Element => {
  const [open, setOpen] = useState<boolean>(depth < 1);
  const tokens = item.path.split("/");
  const filename = tokens[tokens.length - 1];
  const extension = filename.split(".")[1];

  return (
    <>
      <Paper
        elevation={1}
        sx={{ my: 1, borderRadius: LIST_ITEM_BORDER_RADIUS }}
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

          <ListItemText>{filename}</ListItemText>
        </ListItemButton>
      </Paper>

      {item.isDirectory && (
        <Collapse
          in={open}
          sx={{
            ml: 3,
            pl: 3,
            borderLeft: "2px dashed rgba(255, 255, 255, 0.1)",
            outlineOffset: "10px",
          }}
        >
          {item.children.map((children) => (
            <FileOrFolderItem
              key={children.path}
              item={children}
              depth={depth + 1}
            />
          ))}
        </Collapse>
      )}
    </>
  );
};

export default FileOrFolderItem;
