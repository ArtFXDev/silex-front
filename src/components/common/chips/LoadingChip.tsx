import { Box, CircularProgress, Collapse } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useSnackbar, VariantType as NotifVariant } from "notistack";
import { useState } from "react";

type Notification = { variant: NotifVariant; message: string };

interface LoadingChipProps {
  label?: string;
  color: string;
  icon?: JSX.Element;
  onClick: (done: () => void) => void;
  disabled?: boolean;
  clickNotification?: Notification;
  successNotification?: Notification;
}

const LoadingChip = ({
  label,
  color,
  icon,
  onClick,
  disabled,
  clickNotification,
  successNotification,
}: LoadingChipProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>();

  const { enqueueSnackbar } = useSnackbar();

  return (
    <Box
      onClick={() => {
        if (!isLoading && !disabled) {
          setIsLoading(true);

          if (clickNotification) {
            enqueueSnackbar(clickNotification.message, {
              variant: clickNotification.variant,
            });
          }

          const done = () => {
            setIsLoading(false);
            if (successNotification) {
              enqueueSnackbar(successNotification.message, {
                variant: successNotification.variant,
              });
            }
          };
          onClick(done);
        }
      }}
      sx={{
        height: 32,
        display: "inline-flex",
        alignItems: "center",
        border: `1px solid ${disabled ? "rgba(150, 149, 149, 0.5)" : color}`,
        borderRadius: "9999px",
        px: 1,
        transition: "background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        cursor: disabled ? "default" : "pointer",
        "&:hover": {
          backgroundColor: alpha(color, 0.1),
        },
        justifyContent: "center",
      }}
    >
      {icon && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ml: label ? 0.5 : 0,
            mr: label ? 1 : 0,
          }}
        >
          {icon}
        </Box>
      )}

      {label && (
        <span
          style={{
            color: disabled ? "rgba(150, 149, 149, 0.5)" : color,
            fontSize: 13,
            marginRight: 4,
          }}
        >
          {label}
        </span>
      )}

      <Collapse in={isLoading} orientation="horizontal" unmountOnExit>
        <CircularProgress size={18} sx={{ ml: 1, mt: 0.55, color }} />
      </Collapse>
    </Box>
  );
};

export default LoadingChip;
