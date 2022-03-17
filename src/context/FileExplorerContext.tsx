import React, { useContext } from "react";

export interface FileExplorerContext {
  /** Use a compact display for the file hierarchy */
  small?: boolean;

  /** Callback to register when the user click on a file */
  onFileSelect?: (filePath: string) => void;

  /** The selected file path */
  selectedFiles?: string[];

  /** Wether it's possible to select folders */
  selectDirectory?: boolean;

  /** List of extensions to filter */
  filterExtensions?: string[];

  /** Display the modification time */
  moreDetails?: boolean;
}

export const FileExplorerContext = React.createContext<FileExplorerContext>(
  {} as FileExplorerContext
);

type ProvideFileExplorerProps = FileExplorerContext & {
  children: JSX.Element;
};

/**
 * The ProvideAction provides the current action context and handle action updates
 */
export const ProvideFileExplorer = (
  props: ProvideFileExplorerProps
): JSX.Element => {
  return (
    <FileExplorerContext.Provider value={props}>
      {props.children}
    </FileExplorerContext.Provider>
  );
};

export const useFileExplorer = (): FileExplorerContext =>
  useContext(FileExplorerContext);
