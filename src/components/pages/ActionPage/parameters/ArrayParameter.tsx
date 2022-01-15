import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { ArrayParameter as ArrayParameterType } from "types/action/parameters";

interface ArrayParameterProps {
  parameter: ArrayParameterType;
  onChange: (newValues: number[]) => void;
}

/**
 * The ArrayParameter represents multiple numeric values
 * It can be used to input vector type objects for example
 */
const ArrayParameter = ({
  parameter,
  onChange,
}: ArrayParameterProps): JSX.Element => {
  const [values, setValues] = useState<number[]>([]);

  // Update state when the parameter value from action changes
  useEffect(() => {
    setValues(parameter.value || new Array(parameter.type.size).fill(0));
  }, [parameter]);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6.4 }}>
      {values.map((value, i) => (
        <TextField
          sx={{ width: 100 }}
          key={i}
          type="number"
          value={value}
          onChange={(e) => {
            const copy = [...values];
            copy[i] = parseInt(e.target.value);
            onChange(copy);
            setValues(copy);
          }}
        />
      ))}
    </div>
  );
};

export default ArrayParameter;
