import { Tooltip } from "@mui/material";

interface ColoredCircleProps {
  size: number;
  color: string;
  marginLeft?: number;
  marginRight?: number;
  border?: string;
  text?: string;
  tooltip?: { title: string };
  style?: React.CSSProperties;
}

const ColoredCircle = ({
  size,
  color,
  marginLeft,
  marginRight,
  border,
  text,
  tooltip,
  style,
}: ColoredCircleProps): JSX.Element => {
  const content = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: "50%",
        border,
        marginLeft: marginLeft,
        marginRight: marginRight,
        backgroundColor: color,
        lineHeight: 1,
        ...style,
      }}
    >
      {text || ""}
    </div>
  );

  if (tooltip) {
    return (
      <Tooltip arrow placement="top" title={tooltip.title}>
        {content}
      </Tooltip>
    );
  }

  return content;
};

export default ColoredCircle;
