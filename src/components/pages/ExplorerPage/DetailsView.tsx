import { Box, Alert } from "@mui/material";
import useSWR from "swr";

import { pictureThumbnailURL } from "utils/kitsu";
import { fetchSingle } from "./utils";

const urls = ["data/sequences/{id}", "data/shots/{id}", "data/tasks/{id}"];

interface DetailsViewProps {
  depth: number;
  /** The id of the selected item */
  selectedId: string | undefined;
}

const Details: React.FC<DetailsViewProps> = ({ depth, selectedId }) => {
  // Force selectedId to be a string
  selectedId = selectedId as string;

  const urlKey = urls[depth].replace("{id}", selectedId);
  const { data, error } = useSWR(urlKey, fetchSingle);

  return data ? (
    <Box>
      <h1>
        {data.name} <small>({data.type})</small>
      </h1>
      {data.type === "Shot" && data.preview_file_id && (
        <img
          src={pictureThumbnailURL("preview-files", data.preview_file_id)}
          alt="preview"
          loading="lazy"
        />
      )}
    </Box>
  ) : error ? (
    <Alert severity="error" variant="outlined">
      {error}
    </Alert>
  ) : (
    <div></div>
  );
};

const DetailsView: React.FC<DetailsViewProps> = (props) => {
  return props.selectedId ? <Details {...props} /> : null;
};

export default DetailsView;
