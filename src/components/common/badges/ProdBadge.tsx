import { Chip } from "@mui/material";

const ProdBadge = (): JSX.Element => {
  const isDev = window.location.host.includes("localhost");
  const isProd = !window.location.host.includes("preprod");

  return (
    <Chip
      label={isDev ? "dev" : isProd ? "prod" : "beta"}
      variant="outlined"
      size="small"
      color={isDev ? "success" : isProd ? "info" : "warning"}
    />
  );
};

export default ProdBadge;
