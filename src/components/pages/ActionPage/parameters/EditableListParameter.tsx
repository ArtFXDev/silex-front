import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Chip, IconButton, Input, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { EditableListParameter as EditableListParameterType } from "types/action/parameters";

interface EditableListParameterProps {
  parameter: EditableListParameterType;
}

/**
 * A list of elements that the user can edit
 */
const EditableListParameter = ({
  parameter,
}: EditableListParameterProps): JSX.Element => {
  const [inputValue, setInputValue] = useState<string>("");
  const [values, setValues] = useState<string[]>(parameter.value || []);

  // Update state when the parameter value from action changes
  useEffect(() => {
    setValues(parameter.value || []);
  }, [parameter]);

  const setAllValues = (newValues: string[]) => {
    setValues(newValues);
    parameter.value = newValues;
  };

  return (
    <div>
      <div>
        <Input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          color="info"
          sx={{ width: 250 }}
        />

        <Tooltip title="Add item" placement="top" arrow>
          <IconButton
            onClick={() => {
              if (inputValue.length > 0) {
                setAllValues([...values, inputValue]);
                setInputValue("");
              }
            }}
          >
            <AddCircleIcon />
          </IconButton>
        </Tooltip>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 15 }}>
        {values.map((value, i) => (
          <Chip
            label={value}
            key={`${value}-${i}`}
            onDelete={() => {
              setAllValues(values.filter((v) => v !== value));
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default EditableListParameter;
