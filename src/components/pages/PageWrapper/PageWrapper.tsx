import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { Fade, IconButton, Tooltip, Typography } from "@mui/material";
import { useNavigate } from "react-router";

interface PageWrapperProps {
  /** Optional title of the page */
  title?: string | JSX.Element;

  /** Add a go back button */
  goBack?: boolean;

  /** Children to put in the page */
  children?: React.ReactNode;

  /** The page container takes the full height */
  fullHeight?: boolean;

  /** Center the content on the page with flex */
  centerContent?: boolean;

  /** Offset the content of the page on top */
  paddingTop?: number;
}

const PageWrapper = ({
  title,
  children,
  goBack,
  fullHeight,
  centerContent,
  paddingTop,
}: PageWrapperProps): JSX.Element => {
  const navigate = useNavigate();

  return (
    <Fade in timeout={200}>
      <div
        style={{
          padding: 48,
          height: fullHeight ? "100vh" : "",
        }}
      >
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
                    navigate("/");
                  } else {
                    navigate(-1);
                  }
                }}
              >
                <KeyboardReturnIcon />
              </IconButton>
            </Tooltip>
          )}
        </div>

        <div
          style={{
            padding: "16px 0",
            height: fullHeight ? "100%" : "",
          }}
        >
          {centerContent ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                paddingTop,
              }}
            >
              {children}
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </Fade>
  );
};

export default PageWrapper;
