import {
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import { SelectParameter as SelectParameterType } from "types/action/parameters";

interface SelectParameterProps {
  parameter: SelectParameterType;
  onChange: (event: SelectChangeEvent<string | null>) => void;
}

const SelectParameter = ({
  parameter,
  onChange,
}: SelectParameterProps): JSX.Element => {
  const [value, setValue] = useState<string | null>(parameter.value);
  const error = parameter.value === null;

  return (
    <FormControl error={error}>
      <Select
        sx={{
          width: 230,
          height: 40,
          borderRadius: 3,
          paddingTop: 0,
          fontSize: 20,
        }}
        color="info"
        variant="outlined"
        defaultValue={parameter.value}
        onChange={(e) => {
          onChange(e);
          setValue(e.target.value);
        }}
        value={value}
      >
        {parameter.type.options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>Please fill this input</FormHelperText>}
    </FormControl>
  );
};

export default SelectParameter;
