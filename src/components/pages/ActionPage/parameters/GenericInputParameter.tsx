import { Input, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { ParameterInputType } from "~/types/action/parameters";

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
    parameter.value || (parameter.type.name === "int" ? 0 : "")
  );

  // Update state when the parameter value from action changes
  useEffect(() => {
    setValue(parameter.value || (parameter.type.name === "int" ? 0 : ""));
  }, [parameter]);

  const inputError =
    parameter.type.name === "str" && parameter.type.maxLenght && value
      ? value.toString().length > parameter.type.maxLenght
      : false;

  return (
    <>
      <Input
        type={pythonTypeToInputType(parameter.type.name)}
        value={value}
        error={inputError}
        onChange={(e) => {
          setValue(e.target.value);
          parameter.value = e.target.value;
        }}
        color="info"
        sx={{ width: 300 }}
      />
      {inputError && (
        <Typography color="error" fontSize={14}>
          Name is too long...
        </Typography>
      )}
    </>
  );
};

export default GenericInputParameter;
