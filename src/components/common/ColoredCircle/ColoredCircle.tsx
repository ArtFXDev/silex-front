interface ColoredCircleProps {
  size: number;
  color: string;
  marginLeft?: number;
  marginRight?: number;
  border?: string;
}

const ColoredCircle = ({
  size,
  color,
  marginLeft,
  marginRight,
  border,
}: ColoredCircleProps): JSX.Element => (
  <span
    style={{
      display: "inline-block",
      width: size,
      height: size,
      borderRadius: "50%",
      border,
      marginLeft: marginLeft,
      marginRight: marginRight,
      backgroundColor: color,
    }}
  />
);

export default ColoredCircle;
