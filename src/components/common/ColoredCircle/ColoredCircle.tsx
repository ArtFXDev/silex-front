interface ColoredCircleProps {
  size: number;
  color: string;
  marginLeft?: number;
}

const ColoredCircle = ({
  size,
  color,
  marginLeft,
}: ColoredCircleProps): JSX.Element => (
  <span
    style={{
      display: "inline-block",
      width: size,
      height: size,
      borderRadius: "50%",
      marginLeft: marginLeft,
      backgroundColor: color,
    }}
  />
);

export default ColoredCircle;
