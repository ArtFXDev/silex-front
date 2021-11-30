import { QueryResult } from "@apollo/client";
import { CircularProgress, Fade } from "@mui/material";
import CollapseError from "components/common/CollapseError/CollapseError";

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
      <CollapseError
        name={query.error.name}
        message={query.error.message}
        error={query.error}
        sx={{ width: "100%", mt: 8 }}
      />
    );
  }

  return (
    <Fade in timeout={400}>
      <div>{children}</div>
    </Fade>
  );
};

export default QueryWrapper;
