import { Box, Chip, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import { MultipleSelectParameter as MultipleSelectParameterType } from "types/action/parameters";

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

  const handleSelect = (e: SelectChangeEvent<typeof values>) => {
    const value = e.target.value;
    const newValues = typeof value === "string" ? value.split(",") : value;
    onChange(newValues);
    setValues(newValues);
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
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
      >
        {Object.keys(parameter.type.options).map((label) => (
          <MenuItem key={label} value={parameter.type.options[label]}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

export default MultipleSelectParameter;