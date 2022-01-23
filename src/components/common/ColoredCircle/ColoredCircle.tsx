interface ColoredCircleProps {
  size: number;
  color: string;
  marginLeft?: number;
  marginRight?: number;
}

const ColoredCircle = ({
  size,
  color,
  marginLeft,
  marginRight,
}: ColoredCircleProps): JSX.Element => (
  <span
    style={{
      display: "inline-block",
      width: size,
      height: size,
      borderRadius: "50%",
      marginLeft: marginLeft,
      marginRight: marginRight,
      backgroundColor: color,
    }}
  />
);

export default ColoredCircle;
