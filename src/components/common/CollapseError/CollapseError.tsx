import { Alert, AlertTitle, Button, Collapse } from "@mui/material";
import { Theme } from "@mui/material";
import { SxProps } from "@mui/system";
import { useState } from "react";

interface CollapseErrorProps {
  name: string;
  message: string;
  error: unknown;

  sx?: SxProps<Theme>;
}

const CollapseError = ({
  name,
  message,
  error,
  sx,
}: CollapseErrorProps): JSX.Element => {
  const [collapseError, setCollapseError] = useState<boolean>(true);

  return (
    <Alert severity="error" variant="outlined" sx={{ ...sx }}>
      <AlertTitle>{name}</AlertTitle>
      {message}
      <br />
      <br />
      <Button
        variant="outlined"
        onClick={() => setCollapseError(!collapseError)}
      >
        {collapseError ? "More info..." : "Close details"}
      </Button>
      <Collapse in={!collapseError}>
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}
        </pre>
      </Collapse>
    </Alert>
  );
};

export default CollapseError;
