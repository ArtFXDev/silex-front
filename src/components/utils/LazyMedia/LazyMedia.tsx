import HideImageOutlinedIcon from "@mui/icons-material/HideImageOutlined";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import { Box, CircularProgress, Fade } from "@mui/material";
import { createRef, useState } from "react";

interface LazyMediaProps {
  src: { url?: string; extension: string };
  alt: string;
  width: number;
  height: number;
  disableBorder?: boolean;
  disableFade?: boolean;
}

/**
 * A lazy loaded media (image or video) with circular progress on load
 * Also provides a default thumbnail in case of error or empty src
 */
const LazyMedia = (props: LazyMediaProps): JSX.Element => {
  const [isImageLoading, setIsImageLoading] = useState<boolean>(true);
  const [errorLoading, setErrorLoading] = useState<boolean>(false);

  const videoRef = createRef<HTMLVideoElement>();

  const width = `${props.width}px`;
  const height = `${props.height}px`;

  const media = (
    <div style={{ display: isImageLoading ? "none" : "" }}>
      {["png", "gif"].includes(props.src.extension) ? (
        <img
          src={props.src?.url}
          alt={props.alt}
          loading="lazy"
          style={{
            width: width,
            height: height,
          }}
          onLoad={() => setIsImageLoading(false)}
          onError={() => setErrorLoading(true)}
        />
      ) : (
        <video
          width={width}
          height={height}
          style={{ objectFit: "cover" }}
          onLoadedData={() => setIsImageLoading(false)}
          ref={videoRef}
          onMouseMove={(e) => {
            if (videoRef.current) {
              const position = videoRef.current.getBoundingClientRect();
              const diffXNorm = (e.pageX - position.x) / position.width;
              videoRef.current.currentTime =
                diffXNorm * videoRef.current.duration;
            }
          }}
        >
          <source src={props.src.url} type={`video/${props.src.extension}`} />
          Not supported
        </video>
      )}
    </div>
  );

  return (
    <div>
      {props.src.url &&
        (props.disableFade ? (
          media
        ) : (
          <Fade in={!isImageLoading} timeout={400}>
            {media}
          </Fade>
        ))}

      {(isImageLoading || !props.src.url) && (
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
          {errorLoading ? (
            <ReportGmailerrorredIcon color="error" />
          ) : props.src.url ? (
            <CircularProgress size={25} />
          ) : (
            <HideImageOutlinedIcon />
          )}
        </Box>
      )}
    </div>
  );
};

export default LazyMedia;
