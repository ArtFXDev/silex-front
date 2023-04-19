import {
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";

import { useAction } from "~/context";
import { SelectParameter as SelectParameterType } from "~/types/action/parameters";

interface SelectParameterProps {
  parameter: SelectParameterType;
  onChange: (event: SelectChangeEvent<string | null>) => void;
}

const SelectParameter = ({
  parameter,
  onChange,
}: SelectParameterProps): JSX.Element => {
  const [value, setValue] = useState<string | null>(parameter.value);

  const { simpleMode, sendActionUpdate } = useAction();
  const actionUUID = useRouteMatch<{ uuid: string }>().params.uuid;

  // Update state when the parameter value from action changes
  useEffect(() => {
    setValue(parameter.value);
  }, [parameter]);

  const error = parameter.value === null;

  return (
    <FormControl error={error}>
      <Select
        sx={{
          width: 230,
          height: 40,
          borderRadius: 3,
          paddingTop: 0,
          fontSize: simpleMode ? 15 : 20,
        }}
        color="info"
        variant="outlined"
        defaultValue={parameter.value}
        onChange={(e) => {
          onChange(e);
          setValue(e.target.value);
          sendActionUpdate(actionUUID, false);
        }}
        value={value}
      >
        {Object.keys(parameter.type.options).map((label) => (
          <MenuItem key={label} value={parameter.type.options[label]}>
            {label}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>Please fill this input</FormHelperText>}
    </FormControl>
  );
};

export default SelectParameter;
