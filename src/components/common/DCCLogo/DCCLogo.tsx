import { Box, BoxProps } from "@mui/system";
import BlenderLogo from "assets/images/logos/blender.svg";
import HoudiniLogo from "assets/images/logos/houdini.svg";
import MayaLogo from "assets/images/logos/maya.svg";
import NukeLogo from "assets/images/logos/nuke.svg";
import PythonLogo from "assets/images/logos/python.svg";

/**
 * Dictionnary of dcc names and icon paths
 */
const logos: Record<string, string> = {
  blender: BlenderLogo,
  houdini: HoudiniLogo,
  maya: MayaLogo,
  nuke: NukeLogo,
  python: PythonLogo,
};

interface DCCLogoProps {
  /** The name of the icon file eg blender, houdini or maya */
  name: string | null | undefined;

  /** The size of the logo */
  size?: number;

  /** Disable the color */
  disabled?: boolean;
}

/**
 * DCC software logo component
 */
const DCCLogo = ({
  name,
  size,
  sx,
  disabled,
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
      <img
        src={logos[name || "python"]}
        alt={`${name} logo`}
        width={size || 40}
        height={size || 40}
        style={{ filter: disabled ? "grayscale(100%)" : "none" }}
      />
    </Box>
  );
};

export default DCCLogo;
