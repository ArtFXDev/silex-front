import { Alert, Fade, LinearProgress, List } from "@mui/material";
import { uiSocket } from "context";
import { useEffect, useState } from "react";
import { FileOrFolder, ServerResponse } from "types/socket";

import FileOrFolderItem from "./FileOrFolderItem";

interface PublishFilesViewProps {
  taskId: string;
}

const PublishFilesView = ({ taskId }: PublishFilesViewProps): JSX.Element => {
  const [response, setResponse] =
    useState<ServerResponse<{ publishStructure: FileOrFolder }>>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    uiSocket.emit("getPublishedFilesForTask", { taskId }, (response) => {
      setResponse(response);
      setLoading(false);
    });
  }, [taskId]);

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

  if (
    response &&
    response.data.publishStructure.isDirectory &&
    response.data.publishStructure.children.length === 0
  ) {
    return (
      <Alert variant="outlined" severity="info">
        You don{"'"}t have any published files...
      </Alert>
    );
  }

  return (
    <Fade in={!loading} timeout={400}>
      <List>
        {response &&
          response.data.publishStructure.isDirectory &&
          response.data.publishStructure.children.map((item) => (
            <FileOrFolderItem key={item.path} item={item} depth={0} />
          ))}
      </List>
    </Fade>
  );
};

export default PublishFilesView;
