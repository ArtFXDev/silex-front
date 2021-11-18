import HelpIcon from "@mui/icons-material/Help";
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
  name: string | null;

  /** The size of the logo */
  size?: number;
}

/**
 * DCC software logo component
 */
const DCCLogo = ({ name, size, sx }: DCCLogoProps & BoxProps): JSX.Element => {
  return (
    <>
      {name && logos[name] ? (
        <Box
          sx={{
            ...sx,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={name ? logos[name] : undefined}
            alt={`${name} logo`}
            width={size || 40}
            height={size || 40}
          />
        </Box>
      ) : (
        <HelpIcon />
      )}
    </>
  );
};

export default DCCLogo;
