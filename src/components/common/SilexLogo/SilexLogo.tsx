import { Box, SxProps, Theme } from "@mui/material";
import logo from "assets/images/silex_logo.png";
import newYear from "assets/images/wardrobe/new_year.png";
import santa from "assets/images/wardrobe/santa.png";

const clothes = [
  {
    img: santa,
    start: { day: 1, month: 12 },
    end: { day: 31, month: 12 },
  },
  {
    img: newYear,
    start: { day: 1, month: 1 },
    end: { day: 14, month: 1 },
  },
];

function getClothBasedOnDate(): string | undefined {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;

  for (const cloth of clothes) {
    if (
      day >= cloth.start.day &&
      day <= cloth.end.day &&
      month >= cloth.start.month &&
      month <= cloth.end.month
    ) {
      return cloth.img;
    }
  }
}

interface SilexLogoProps {
  size: number;
  sx?: SxProps<Theme>;
  onClick?: () => void;
}

const SilexLogo = ({ size, sx, onClick }: SilexLogoProps): JSX.Element => {
  const cloth = getClothBasedOnDate();

  return (
    <Box sx={{ ...sx, position: "relative" }} onClick={onClick}>
      <img src={logo} alt="silex logo" width={size} height={size} />

      {cloth && (
        <img
          src={cloth}
          width={size}
          height={size}
          style={{ position: "absolute", top: 0, left: 0 }}
        />
      )}
    </Box>
  );
};

export default SilexLogo;
