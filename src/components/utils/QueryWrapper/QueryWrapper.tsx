import { QueryResult } from "@apollo/client";
import {
  Alert,
  AlertTitle,
  Button,
  CircularProgress,
  Collapse,
  Fade,
} from "@mui/material";
import { useState } from "react";

interface QueryWrapperProps {
  query: QueryResult;
  children?: React.ReactNode;
}

const QueryWrapper = ({ query, children }: QueryWrapperProps): JSX.Element => {
  const [collapseError, setCollapseError] = useState<boolean>(true);

  if (query.loading) {
    return <CircularProgress />;
  }

  if (query.error) {
    return (
      <Alert severity="error" variant="outlined" sx={{ width: "100%", mt: 8 }}>
        <AlertTitle>{query.error.name}</AlertTitle>
        {query.error.message}
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
            {JSON.stringify(query.error, null, 2)}
          </pre>
        </Collapse>
      </Alert>
    );
  }

  return (
    <Fade in timeout={400}>
      <div>{children}</div>
    </Fade>
  );
};

export default QueryWrapper;
