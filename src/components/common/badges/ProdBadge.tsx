import { Chip } from "@mui/material";
import { getCurrentMode } from "utils/action";

const ProdBadge = (): JSX.Element => {
  const mode = getCurrentMode();

  return (
    <Chip
      label={mode}
      variant="outlined"
      size="small"
      color={mode === "dev" ? "success" : mode === "prod" ? "info" : "warning"}
    />
  );
};

export default ProdBadge;
