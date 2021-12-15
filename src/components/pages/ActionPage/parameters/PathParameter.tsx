import ClearIcon from "@mui/icons-material/Clear";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import {
  Alert,
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import isElectron from "is-electron";
import { useRef, useState } from "react";
import { PathParameter as PathParameterType } from "types/action/parameters";
import { humanFileSize } from "utils/string";
import { v4 as uuidv4 } from "uuid";

/**
 * Extends the interface in case we are in Electron
 * and the path attribute is given
 */
interface FileWithPath extends File {
  readonly path: string;
}

interface PathParameterProps {
  parameter: PathParameterType;
}

const PathParameter = ({ parameter }: PathParameterProps): JSX.Element => {
  const inputElement = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileWithPath[]>([]);

  if (!isElectron()) {
    return (
      <Alert variant="outlined" color="warning">
        You are not viewing this inside Electron, the Path input is not going to
        work
      </Alert>
    );
  }

  const uuid = uuidv4();

  const updateFiles = (newFiles: FileWithPath[]) => {
    if (parameter.type.multiple) {
      parameter.value = newFiles.map((f) => f.path);
    } else {
      if (newFiles.length === 1) {
        parameter.value = newFiles[0].path;
      } else {
        parameter.value = null;
      }
    }

    setFiles(newFiles);
  };

  return (
    <>
      <input
        type="file"
        accept={
          parameter.type.extensions ? parameter.type.extensions.join(",") : ""
        }
        style={{ display: "none" }}
        id={`file-input-${uuid}`}
        multiple={parameter.type.multiple ? true : undefined}
        ref={inputElement}
        onChange={(e) => {
          const targetAsInput = e.target as HTMLInputElement;

          if (targetAsInput.files) {
            updateFiles(Array.from(targetAsInput.files) as FileWithPath[]);
          }
        }}
      />

      <div>
        <label htmlFor={`file-input-${uuid}`}>
          <Button
            variant="outlined"
            component="span"
            endIcon={<FileOpenIcon />}
            sx={{
              alignSelf: "flex-start",
              "&.MuiButton-root": {
                border: "1px rgba(255, 255, 255, 0.5) solid",
                color: "rgba(255, 255, 255, 0.75)",
              },
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              },
            }}
          >
            Choose file(s)
          </Button>
        </label>

        <p
          style={{
            marginLeft: "15px",
            display: "inline-block",
            color: "rgba(255, 255, 255, 0.6)",
          }}
        >
          {files.length > 0
            ? `${files.length} file${files.length > 1 ? "s" : ""}`
            : "No files choosen..."}
        </p>

        {files.length > 0 && (
          <IconButton
            onClick={() => updateFiles([])}
            sx={{ ml: 1 }}
            size="small"
          >
            <ClearIcon color="disabled" />
          </IconButton>
        )}
      </div>

      <div style={{ marginTop: "10px" }}>
        {files
          .sort((f1, f2) => f1.path.localeCompare(f2.path))
          .map((file) => (
            <Box
              key={file.path}
              sx={{
                display: "flex",
                alignItems: "center",
                transition: "all 0.2s ease",
                "&:hover": {
                  "& .MuiTypography-root": {
                    color: "rgba(255, 255, 255, 0.9)",
                  },
                },
              }}
            >
              <Tooltip title={file.path} arrow placement="top">
                <Typography
                  color="text.disabled"
                  sx={{
                    mr: "auto",
                    maxWidth: "80%",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    direction: "rtl",
                    textAlign: "left",
                  }}
                  display="inline-block"
                >
                  {file.name}
                </Typography>
              </Tooltip>

              <Typography
                color="text.disabled"
                fontSize={12}
                display="inline-block"
                sx={{ ml: 2 }}
              >
                ({humanFileSize(file.size)})
              </Typography>
            </Box>
          ))}
      </div>
    </>
  );
};

export default PathParameter;
