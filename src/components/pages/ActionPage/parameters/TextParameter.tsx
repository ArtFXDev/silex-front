import { Typography } from "@mui/material";
import { TextParameter as TextParameterType } from "types/action/parameters";

interface TextParameterProps {
  parameter: TextParameterType;
}

const TextParameter = ({ parameter }: TextParameterProps): JSX.Element => {
  return (
    <Typography
      color={parameter.type.color ? `${parameter.type.color}.main` : ""}
    >
      {parameter.value &&
        parameter.value.split(/(\n)/g).map((token, i) =>
          token === "\n" ? (
            <br key={i} />
          ) : (
            <span key={i} style={{ wordBreak: "normal" }}>
              {token}
            </span>
          )
        )}
    </Typography>
  );
};

export default TextParameter;
