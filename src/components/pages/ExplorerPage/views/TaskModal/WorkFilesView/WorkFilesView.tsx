import { Alert, Fade, List } from "@mui/material";
import { useEffect, useState } from "react";
import { useMatch } from "react-router-dom";

import { uiSocket } from "~/context";
import { FileOrFolder, ServerResponse } from "~/types/socket";

import WorkFileItem from "./WorkFileItem";

interface WorkFilesViewProps {
  path: string;
  moreDetails: boolean;
  sortByModificationDate: boolean;
  refresh?: boolean;
}

const WorkFilesView = ({
  path,
  moreDetails,
  refresh,
  sortByModificationDate,
}: WorkFilesViewProps): JSX.Element => {
  const [response, setResponse] =
    useState<ServerResponse<{ files: FileOrFolder[] }>>();
  const taskId = useMatch(":taskId")?.params.taskId as string;

  useEffect(() => {
    uiSocket.emit(
      "searchDirRecursive",
      {
        path,
        extensions: ["ma", "mb", "hip", "hipnc", "blend", "nk"],
        ignore: ["**/backup/**"],
      },
      (response) => {
        setResponse(response);
      }
    );
  }, [path, refresh]);

  if (response && response.status !== 200) {
    return (
      <Alert
        variant="outlined"
        severity={response.status === 404 ? "info" : "error"}
      >
        The work folder doesn{"'"}t exist yet...
      </Alert>
    );
  }

  if (response && response.data && response.data.files.length === 0) {
    return (
      <Alert variant="outlined" severity="info">
        The work folder is empty...
      </Alert>
    );
  }

  return (
    <Fade in timeout={400}>
      <List>
        {response &&
          response.data &&
          response.data.files
            .sort((a, b) =>
              sortByModificationDate
                ? new Date(b.mtime).getTime() - new Date(a.mtime).getTime()
                : a.name.localeCompare(b.name)
            )
            .map((file) => (
              <WorkFileItem
                key={file.path}
                file={file}
                moreDetails={moreDetails}
                taskId={taskId}
              />
            ))}
      </List>
    </Fade>
  );
};

export default WorkFilesView;
