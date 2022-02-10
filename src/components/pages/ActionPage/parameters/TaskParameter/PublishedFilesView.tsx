import FileOrFolderItem from "components/common/FileOrFolderItem/FileOrFolderItem";
import { useEffect, useState } from "react";
import * as Zou from "utils/zou";

interface PublishedFilesViewProps {
  taskId: string;
  selectedFilePath: string | undefined;

  /** Called when the user select a file */
  onFileSelect: (filePath: string) => void;

  /** Filter extensions */
  filterExtensions?: string[];
}

const PublishedFilesView = ({
  taskId,
  onFileSelect,
  selectedFilePath,
  filterExtensions,
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
    <FileOrFolderItem
      root
      small
      onFileSelect={onFileSelect}
      selectedFile={selectedFilePath}
      filterExtensions={filterExtensions}
      item={{
        path: path,
        name: "",
        mtime: "",
        isDirectory: true,
      }}
    />
  );
};

export default PublishedFilesView;
