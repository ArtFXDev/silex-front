import HideImageOutlinedIcon from "@mui/icons-material/HideImageOutlined";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import { Box, CircularProgress, Fade } from "@mui/material";
import { createRef, useState } from "react";

import { extensionHasTag } from "~/utils/files";

interface LazyMediaProps {
  src: { url: string; extension: string } | undefined;
  alt: string;
  width: number;
  height: number;
  disableBorder?: boolean;
  disableFade?: boolean;
  objectFit?: "cover" | "contain";
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

  /**
   * Called when the mouse is over a video, playback the frame based on the position
   */
  const onMouseMoveOnVideo = (
    e: React.MouseEvent<HTMLVideoElement, MouseEvent>
  ) => {
    if (videoRef.current) {
      const position = videoRef.current.getBoundingClientRect();
      if (position.width > 0) {
        const diffXNorm = (e.pageX - position.x) / position.width;
        videoRef.current.currentTime = diffXNorm * videoRef.current.duration;
      }
    }
  };

  const media = (src: { url: string; extension: string }): JSX.Element => (
    <div>
      {extensionHasTag(src.extension, "image") ? (
        <img
          src={src.url}
          alt={props.alt}
          loading="lazy"
          style={{
            display: "block",
            width,
            height,
            objectFit: props.objectFit,
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
          onMouseMove={onMouseMoveOnVideo}
        >
          <source src={src.url} type={`video/${src.extension}`} />
          Not supported
        </video>
      )}
    </div>
  );

  return (
    <div style={{ position: "relative", width, height }}>
      {props.src && (
        <Fade
          in={!isImageLoading}
          timeout={props.disableFade ? 0 : 400}
          style={{ top: 0, left: 0 }}
        >
          {media(props.src)}
        </Fade>
      )}

      {(isImageLoading || !props.src) && (
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            width,
            height,
            justifyContent: "center",
            alignItems: "center",

            backgroundColor: "rgba(255, 255, 255, 0.1)",
            border: !props.disableBorder
              ? "2px solid rgba(255, 255, 255, 0.2)"
              : "",
            borderRadius: !props.disableBorder ? "5px" : "",
          }}
        >
          {errorLoading ? (
            <ReportGmailerrorredIcon color="error" />
          ) : props.src ? (
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
