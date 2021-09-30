import { Box, CircularProgress, Fade } from "@mui/material";
import HideImageOutlinedIcon from "@mui/icons-material/HideImageOutlined";
import { useState } from "react";

interface LazyImageProps {
  /** Source url if the image, if undefined a default icon is shown */
  src?: string;
  alt: string;
  width: number;
  height: number;
  disableBorder?: boolean;
  onClick?: () => void;
  disableFade?: boolean;
}

/**
 * A lazy loaded image with circular progress on load
 * Also provides a default thumbnail in case of error or empty src
 */
const LazyImage: React.FC<LazyImageProps> = (props) => {
  const [isImageLoading, setIsImageLoading] = useState<boolean>(true);

  const width = `${props.width}px`;
  const height = `${props.height}px`;

  const img = (
    <img
      src={props.src}
      alt={props.alt}
      loading="lazy"
      style={{
        width: width,
        height: height,
      }}
      onLoad={() => setIsImageLoading(false)}
    />
  );

  return (
    <div
      style={{ cursor: props.onClick ? "pointer" : "default" }}
      onClick={props.onClick}
    >
      {props.src &&
        (props.disableFade ? (
          { img }
        ) : (
          <Fade in={!isImageLoading} timeout={400}>
            {img}
          </Fade>
        ))}

      {(isImageLoading || !props.src) && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: width,
            height: height,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            border: !props.disableBorder
              ? "2px solid rgba(255, 255, 255, 0.2)"
              : "",
            borderRadius: !props.disableBorder ? "5px" : "",
          }}
        >
          {props.src ? <CircularProgress /> : <HideImageOutlinedIcon />}
        </Box>
      )}
    </div>
  );
};

export default LazyImage;
