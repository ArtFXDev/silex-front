import { Typography } from "@mui/material";

interface ArrowDelimiterProps {
  mx?: number;
  fontSize?: number;
}

const ArrowDelimiter = ({ mx, fontSize }: ArrowDelimiterProps): JSX.Element => (
  <Typography
    color="text.disabled"
    sx={{ mx: mx || 0.8 }}
    fontSize={fontSize || 16}
    display="inline-block"
  >
    🢒
  </Typography>
);

export default ArrowDelimiter;
