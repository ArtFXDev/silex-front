import { Input } from "@mui/material";
import { ParameterInputType } from "types/action/parameters";

/**
 * Maps python type to input type
 */
const pythonTypeToInputType = (
  type: ParameterInputType["type"]["name"]
): React.InputHTMLAttributes<unknown>["type"] => {
  switch (type) {
    case "int":
      return "number";
    case "str":
      return "text";
    default:
      return "text";
  }
};

interface GenericInputParameterProps {
  parameter: ParameterInputType;
}

const GenericInputParameter = ({
  parameter,
}: GenericInputParameterProps): JSX.Element => {
  return (
    <Input
      type={pythonTypeToInputType(parameter.type.name)}
      placeholder={parameter.value?.toString()}
      onChange={(e) => {
        parameter.value = e.target.value;
      }}
      color="info"
    />
  );
};

export default GenericInputParameter;
