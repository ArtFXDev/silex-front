import ImageIcon from "@mui/icons-material/Image";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import VideocamIcon from "@mui/icons-material/Videocam";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import { Box, BoxProps } from "@mui/system";
import ArnoldLogo from "assets/images/logos/arnold.svg";
import BlenderLogo from "assets/images/logos/blender.svg";
import GLTFLogo from "assets/images/logos/gltf.svg";
import HoudiniLogo from "assets/images/logos/houdini.svg";
import MayaLogo from "assets/images/logos/maya.svg";
import NukeLogo from "assets/images/logos/nuke.svg";
import OpenVDBLogo from "assets/images/logos/openvdb.svg";
import PythonLogo from "assets/images/logos/python.svg";
import USDLogo from "assets/images/logos/usd.svg";
import VrayLogo from "assets/images/logos/vray.svg";
import { getExtensionFromName } from "utils/files";

/**
 * Dictionnary of dcc names and icon paths
 */
const logos: Record<string, string> = {
  arnold: ArnoldLogo,
  blender: BlenderLogo,
  houdini: HoudiniLogo,
  maya: MayaLogo,
  nuke: NukeLogo,
  python: PythonLogo,
  vray: VrayLogo,
  openvdb: OpenVDBLogo,
  usd: USDLogo,
  gltf: GLTFLogo,
};

/**
 * Fallback icons based on tags
 */
const fallbackIcons: { [tag: string]: JSX.Element } = {
  image: <ImageIcon />,
  geometry: <ViewInArIcon />,
  video: <VideocamIcon />,
  light: <LightbulbIcon />,
};

interface FileIconProps {
  /** The name of the icon file eg blender, houdini or maya */
  name: string | null | undefined;

  /** The size of the logo */
  size?: number;

  /** Disable the color */
  disabled?: boolean;

  /** Opacity from 0 to 1 */
  opacity?: number;

  /** Wether it's an action or not */
  action?: boolean;
}

/**
 * DCC software logo component
 */
const FileIcon = ({
  name,
  size,
  sx,
  disabled,
  action,
  opacity,
}: FileIconProps & BoxProps): JSX.Element => {
  let fallbackIcon;
  const foundLogo = name && logos[name];

  // Get the fallback icon if we didn't find a logo from the extension
  if (name && !foundLogo) {
    const extension = getExtensionFromName(name);

    if (extension && extension.tags) {
      for (const tag of extension.tags) {
        fallbackIcon = fallbackIcons[tag];
        if (fallbackIcon) break;
      }
    }
  }

  return (
    <Box
      sx={{
        ...sx,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {action || foundLogo ? (
        <img
          src={logos[name || "python"]}
          alt={`${name} logo`}
          width={size || 40}
          height={size || 40}
          style={{
            filter: disabled ? "grayscale(100%)" : "none",
            opacity: opacity || 1,
          }}
        />
      ) : fallbackIcon ? (
        <fallbackIcon.type color="disabled" />
      ) : (
        <InsertDriveFileIcon color="disabled" />
      )}
    </Box>
  );
};

export default FileIcon;
