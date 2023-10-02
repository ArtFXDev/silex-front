import {
  Button,
  Chip,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useMatch } from "react-router-dom";

import { useAction } from "~/context";
import { MultipleSelectParameter as MultipleSelectParameterType } from "~/types/action/parameters";

// Used for styling the Select input
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface MultipleSelectParameterProps {
  parameter: MultipleSelectParameterType;
  onChange: (newValues: string[]) => void;
}

/**
 * A selector with multiple entries displayed as chips
 */
const MultipleSelectParameter = ({
  parameter,
  onChange,
}: MultipleSelectParameterProps): JSX.Element => {
  const [values, setValues] = useState<string[]>(parameter.value || []);

  const { sendActionUpdate } = useAction();
  const actionUUID = useMatch(":uuid")?.params.uuid as string;

  // Update state when the parameter value from action changes
  useEffect(() => {
    setValues(parameter.value || []);
  }, [parameter]);

  const handleSelect = (e: SelectChangeEvent<typeof values>) => {
    const value = e.target.value;
    const newValues = typeof value === "string" ? value.split(",") : value;
    onChange(newValues);
    setValues(newValues);
    sendActionUpdate(actionUUID, false);
  };

  return (
    <div>
      <Select
        sx={{
          width: 250,
          borderRadius: 3,
          paddingTop: 0,
          fontSize: 15,
        }}
        color="info"
        variant="outlined"
        placeholder="Select a value..."
        onChange={handleSelect}
        value={values}
        multiple
        MenuProps={MenuProps}
        renderValue={(selected) => (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {selected.map((value) => {
              const labelFromValue = Object.keys(parameter.type.options).find(
                (k) => parameter.type.options[k] === value
              );
              return <Chip key={value} label={labelFromValue} />;
            })}
          </div>
        )}
      >
        {Object.keys(parameter.type.options).map((label) => (
          <MenuItem key={label} value={parameter.type.options[label]}>
            {label}
          </MenuItem>
        ))}
      </Select>

      <Button
        variant="outlined"
        color="secondary"
        size="small"
        disabled={values.length === Object.keys(parameter.type.options).length}
        sx={{ ml: 2, p: 0, minWidth: 40, textTransform: "none" }}
        onClick={() => {
          const allValues = Object.values(parameter.type.options);
          setValues(allValues);
          onChange(allValues);
        }}
      >
        All
      </Button>

      <Button
        variant="outlined"
        color="secondary"
        size="small"
        disabled={values.length === 0}
        sx={{ ml: 1, p: 0, minWidth: 50, textTransform: "none" }}
        onClick={() => {
          setValues([]);
          onChange([]);
        }}
      >
        Clear
      </Button>
    </div>
  );
};

export default MultipleSelectParameter;
