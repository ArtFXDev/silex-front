import { Input } from "@mui/material";
import { useEffect, useState } from "react";
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
  const [value, setValue] = useState<ParameterInputType["value"]>(
    parameter.value
  );

  // Update state when the parameter value from action changes
  useEffect(() => {
    setValue(parameter.value);
  }, [parameter]);

  return (
    <Input
      type={pythonTypeToInputType(parameter.type.name)}
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        parameter.value = e.target.value;
      }}
      color="info"
    />
  );
};

export default GenericInputParameter;
