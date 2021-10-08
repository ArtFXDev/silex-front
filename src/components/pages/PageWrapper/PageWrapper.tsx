import { Box, Fade, Typography } from "@mui/material";

interface PageWrapperProps {
  /** Optional title of the page */
  title?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ title, children }) => (
  <Fade in timeout={200}>
    <Box p={6} height="100%">
      {title && <Typography variant="h4">{title}</Typography>}
      <Box sx={{ py: 2 }}>{children}</Box>
    </Box>
  </Fade>
);

export default PageWrapper;
