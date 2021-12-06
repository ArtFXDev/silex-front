import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { Box, Fade, IconButton, Tooltip, Typography } from "@mui/material";
import { useHistory } from "react-router";

interface PageWrapperProps {
  /** Optional title of the page */
  title?: string;

  /** Add a go back button */
  goBack?: boolean;

  /** Children to put in the page */
  children?: React.ReactNode;

  /** The page container takes the full height */
  fullHeight?: boolean;
}

const PageWrapper = ({
  title,
  children,
  goBack,
  fullHeight,
}: PageWrapperProps): JSX.Element => {
  const history = useHistory();

  return (
    <Fade in timeout={200}>
      <Box p={6} sx={{ height: fullHeight ? "100vh" : "" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {title && <Typography variant="h4">{title}</Typography>}

          {goBack && (
            <Tooltip title="Go back" placement="top" arrow>
              <IconButton
                sx={{ ml: "auto" }}
                onClick={() => {
                  if (history.length === 1) {
                    history.push("/");
                  } else {
                    history.goBack();
                  }
                }}
              >
                <KeyboardReturnIcon />
              </IconButton>
            </Tooltip>
          )}
        </div>

        <Box sx={{ py: 2, height: fullHeight ? "100%" : "" }}>{children}</Box>
      </Box>
    </Fade>
  );
};

export default PageWrapper;
