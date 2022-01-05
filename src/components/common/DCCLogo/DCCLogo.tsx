import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { Box, BoxProps } from "@mui/system";
import ArnoldLogo from "assets/images/logos/arnold.svg";
import BlenderLogo from "assets/images/logos/blender.svg";
import HoudiniLogo from "assets/images/logos/houdini.svg";
import MayaLogo from "assets/images/logos/maya.svg";
import NukeLogo from "assets/images/logos/nuke.svg";
import PythonLogo from "assets/images/logos/python.svg";
import VrayLogo from "assets/images/logos/vray.svg";

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
};

interface DCCLogoProps {
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
const DCCLogo = ({
  name,
  size,
  sx,
  disabled,
  action,
  opacity,
}: DCCLogoProps & BoxProps): JSX.Element => {
  return (
    <Box
      sx={{
        ...sx,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {action || (name && logos[name]) ? (
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
      ) : (
        <InsertDriveFileIcon color="disabled" />
      )}
    </Box>
  );
};

export default DCCLogo;
