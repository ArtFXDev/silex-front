import HelpIcon from "@mui/icons-material/Help";
import { Box, BoxProps } from "@mui/system";

import BlenderLogo from "assets/images/logos/blender.svg";
import HoudiniLogo from "assets/images/logos/houdini.svg";
import MayaLogo from "assets/images/logos/maya.svg";
import NukeLogo from "assets/images/logos/nuke.svg";

/**
 * Dictionnary of dcc name and icon path
 */
const logos: Record<string, string> = {
  blender: BlenderLogo,
  houdini: HoudiniLogo,
  maya: MayaLogo,
  nuke: NukeLogo,
};

interface DCCLogoProps {
  /** The name of the icon file eg blender, houdini or maya */
  name: string | null;
}

const DCCLogo = ({ name, sx }: DCCLogoProps & BoxProps): JSX.Element => {
  return (
    <>
      {name && logos[name] ? (
        <Box sx={sx}>
          <img
            src={name ? logos[name] : undefined}
            alt={`${name} logo`}
            width={40}
            height={40}
          />
        </Box>
      ) : (
        <HelpIcon />
      )}
    </>
  );
};

export default DCCLogo;
