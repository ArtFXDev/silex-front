import { QueryResult } from "@apollo/client";
import { CircularProgress, Fade } from "@mui/material";

import CollapseError from "~/components/common/CollapseError/CollapseError";

interface QueryWrapperProps<T> {
  query: QueryResult<T>;
  render: (data: T) => React.ReactNode;
  fullWidth?: boolean;
}

const QueryWrapper = <T,>({
  query,
  render,
  fullWidth,
}: QueryWrapperProps<T>): JSX.Element => {
  if (query.loading) {
    return <CircularProgress size={30} />;
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

  // Force cast data to return type
  const data = query.data as T;

  return (
    <Fade in timeout={400} style={{ width: fullWidth ? "100%" : "" }}>
      <div>{render(data)}</div>
    </Fade>
  );
};

export default QueryWrapper;
