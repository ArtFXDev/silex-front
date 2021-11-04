import { Box, Fade, Typography } from "@mui/material";

interface PageWrapperProps {
  /** Optional title of the page */
  title?: string;

  /** Children to put in the page */
  children?: React.ReactNode;
}

const PageWrapper = ({ title, children }: PageWrapperProps): JSX.Element => (
  <Fade in timeout={200}>
    <Box p={6}>
      {title && <Typography variant="h4">{title}</Typography>}
      <Box sx={{ py: 2 }}>{children}</Box>
    </Box>
  </Fade>
);

export default PageWrapper;
