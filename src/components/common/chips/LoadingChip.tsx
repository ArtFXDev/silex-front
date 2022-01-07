import { Box, CircularProgress, Collapse } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useSnackbar, VariantType as NotifVariant } from "notistack";
import { useState } from "react";

interface LoadingChipProps {
  label: string;
  color: string;
  icon: JSX.Element;
  onClick: (done: () => void) => void;
  notif?: { variant: NotifVariant; message: string };
}

const LoadingChip = ({
  label,
  color,
  icon,
  onClick,
  notif,
}: LoadingChipProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>();

  const { enqueueSnackbar } = useSnackbar();

  return (
    <Box
      onClick={() => {
        if (!isLoading) {
          setIsLoading(true);

          if (notif) {
            enqueueSnackbar(notif.message, { variant: notif.variant });
          }

          const done = () => setIsLoading(false);
          onClick(done);
        }
      }}
      sx={{
        height: 32,
        display: "flex",
        alignItems: "center",
        border: `1px solid ${color}`,
        borderRadius: "9999px",
        px: 1,
        transition: "background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        cursor: "pointer",
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
      <span style={{ color, fontSize: 13 }}>{label}</span>

      <Collapse in={isLoading} orientation="horizontal" unmountOnExit>
        <CircularProgress size={18} sx={{ ml: 1, mt: 0.55, color }} />
      </Collapse>
    </Box>
  );
};

export default LoadingChip;
