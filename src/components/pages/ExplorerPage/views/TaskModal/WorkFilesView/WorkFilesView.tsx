import { Alert, Fade, LinearProgress, List } from "@mui/material";
import { useSocket } from "context";
import { useEffect, useState } from "react";
import { GetWorkingFilesForTaskResponse } from "types/socket";

import WorkFileItem from "./WorkFileItem";

interface WorkFilesViewProps {
  taskId: string;
  moreDetails?: boolean;
  sortByModificationDate?: boolean;
}

const WorkFilesView = ({
  taskId,
  moreDetails,
  sortByModificationDate,
}: WorkFilesViewProps): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(true);
  const [response, setResponse] = useState<GetWorkingFilesForTaskResponse>();

  const { uiSocket } = useSocket();

  useEffect(() => {
    uiSocket.emit(
      "getWorkingFilesForTask",
      { taskId, searchExtensions: ["ma", "mb", "hip", "hipnc", "blend", "nk"] },
      (response) => {
        setResponse(response);
        setLoading(false);
      }
    );
  }, [taskId, uiSocket]);

  if (loading) {
    return <LinearProgress color="success" />;
  }

  if (response && response.status !== 200) {
    return (
      <Alert
        variant="outlined"
        severity={response.status === 404 ? "info" : "error"}
      >
        {response.msg}
      </Alert>
    );
  }

  if (response && response.data.files.length === 0) {
    return (
      <Alert variant="outlined" severity="info">
        You don{"'"}t have any work files...
      </Alert>
    );
  }

  return (
    <Fade in={!loading} timeout={400}>
      <List>
        {response &&
          response.data.files &&
          response.data.files
            .sort((a, b) =>
              sortByModificationDate
                ? new Date(b.mtime).getTime() - new Date(a.mtime).getTime()
                : a.name.localeCompare(b.name)
            )
            .map((file) => (
              <WorkFileItem
                key={file.path}
                taskId={taskId}
                file={file}
                moreDetails={moreDetails}
              />
            ))}
      </List>
    </Fade>
  );
};

export default WorkFilesView;
