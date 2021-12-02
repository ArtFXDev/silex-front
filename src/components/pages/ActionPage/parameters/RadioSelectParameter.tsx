import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useEffect, useState } from "react";
import { RadioSelectParameter as RadioSelectParameterType } from "types/action/parameters";

interface RadioSelectParameterProps {
  parameter: RadioSelectParameterType;
}

/**
 * A selector with multiple entries displayed as chips
 */
const RadioSelectParameter = ({
  parameter,
}: RadioSelectParameterProps): JSX.Element => {
  const [value, setValue] = useState<string | null>(null);

  // Update state when the parameter value from action changes
  useEffect(() => {
    setValue(parameter.value || null);
  }, [parameter]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    parameter.value = event.target.value;
  };

  return (
    <FormControl component="fieldset">
      <RadioGroup value={value} row onChange={handleChange}>
        {Object.keys(parameter.type.options).map((label) => (
          <FormControlLabel
            key={parameter.type.options[label]}
            value={parameter.type.options[label]}
            control={<Radio color="info" />}
            label={label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default RadioSelectParameter;
