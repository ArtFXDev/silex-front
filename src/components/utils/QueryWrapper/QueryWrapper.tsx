import { QueryResult } from "@apollo/client";
import { Alert, AlertTitle, CircularProgress, Fade } from "@mui/material";

interface QueryWrapperProps {
  query: QueryResult;
  children?: React.ReactNode;
}

const QueryWrapper = ({ query, children }: QueryWrapperProps): JSX.Element => {
  if (query.loading) {
    return <CircularProgress />;
  }

  if (query.error) {
    return (
      <Alert severity="error" variant="outlined" sx={{ minWidth: 500 }}>
        <AlertTitle>{query.error.name}</AlertTitle>
        {query.error.message}
        <pre>{JSON.stringify(query.error.graphQLErrors, null, 2)}</pre>
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