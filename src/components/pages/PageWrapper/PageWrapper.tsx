import { Box, Fade, Typography } from "@mui/material";

interface PageWrapperProps {
  /** Optional title of the page */
  title?: string;

  children: JSX.Element;
}

const PageWrapper = ({ title, children }: PageWrapperProps): JSX.Element => (
  <Fade in timeout={200}>
    <Box p={6} height="100%">
      {title && <Typography variant="h4">{title}</Typography>}
      <Box p={2}>{children}</Box>
    </Box>
  </Fade>
);

export default PageWrapper;
