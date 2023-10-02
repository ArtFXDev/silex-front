import { useEffect, useState } from "react";

import FileOrFolderItem from "~/components/common/FileOrFolderItem/FileOrFolderItem";
import { ProvideFileExplorer } from "~/context/FileExplorerContext";
import * as Zou from "~/utils/zou";

interface PublishedFilesViewProps {
  taskId: string;
  selectedFiles: string[];

  /** Called when the user select a file */
  onFileSelect: (filePath: string) => void;

  /** Filter extensions */
  filterExtensions?: string[];

  selectDirectory?: boolean;
}

const PublishedFilesView = ({
  taskId,
  onFileSelect,
  selectedFiles,
  filterExtensions,
  selectDirectory,
}: PublishedFilesViewProps): JSX.Element => {
  const [path, setPath] = useState<string>();

  // Retrieve the publish file path location based on the task
  useEffect(() => {
    Zou.buildWorkingFilePath(taskId).then((response) =>
      setPath(response.data.path.replace("work", "publish"))
    );
  }, [taskId]);

  if (!path) {
    return <div>Loading...</div>;
  }

  return (
    <ProvideFileExplorer
      small
      onFileSelect={onFileSelect}
      selectedFiles={selectedFiles}
      filterExtensions={filterExtensions}
      selectDirectory={selectDirectory}
    >
      <FileOrFolderItem
        root
        item={{
          path: path,
          name: "",
          mtime: "",
          isDirectory: true,
          isSequence: false,
        }}
      />
    </ProvideFileExplorer>
  );
};

export default PublishedFilesView;
