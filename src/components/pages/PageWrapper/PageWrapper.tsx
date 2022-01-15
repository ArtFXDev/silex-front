import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { Fade, IconButton, Tooltip, Typography } from "@mui/material";
import { useHistory } from "react-router";

interface PageWrapperProps {
  /** Optional title of the page */
  title?: string | JSX.Element;

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
      <div style={{ padding: 48, height: fullHeight ? "100vh" : "" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {title &&
            (typeof title === "string" ? (
              <Typography variant="h4">{title}</Typography>
            ) : (
              title
            ))}

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

        <div style={{ padding: "16px 0", height: fullHeight ? "100%" : "" }}>
          {children}
        </div>
      </div>
    </Fade>
  );
};

export default PageWrapper;
