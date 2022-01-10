import { Box, CircularProgress, Collapse } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useState } from "react";

interface LoadingChipProps {
  label: string;
  color: string;
  icon: JSX.Element;
  onClick: (done: () => void) => void;
  disabled?: boolean;
}

const LoadingChip = ({
  label,
  color,
  icon,
  onClick,
  disabled,
}: LoadingChipProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>();

  return (
    <Box
      onClick={() => {
        if (!isLoading && !disabled) {
          setIsLoading(true);
          onClick(() => setIsLoading(false));
        }
      }}
      sx={{
        height: 32,
        display: "flex",
        alignItems: "center",
        border: `1px solid ${disabled ? "rgba(150, 149, 149, 0.5)" : color}`,
        borderRadius: "9999px",
        px: 1,
        transition: "background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        cursor: disabled ? "default" : "pointer",
        "&:hover": {
          backgroundColor: alpha(color, 0.1),
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ml: 0.5,
          mr: 1,
        }}
      >
        {icon}
      </Box>
      <span
        style={{
          color: disabled ? "rgba(150, 149, 149, 0.5)" : color,
          fontSize: 13,
          marginRight: 4,
        }}
      >
        {label}
      </span>

      <Collapse in={isLoading} orientation="horizontal" unmountOnExit>
        <CircularProgress size={18} sx={{ ml: 1, mt: 0.5, color }} />
      </Collapse>
    </Box>
  );
};

export default LoadingChip;
