import { Box, ListItem, Slider, Switch, Typography } from "@mui/material";
import { LIST_ITEM_BORDER_RADIUS } from "style/constants";
import {
  ArrayParameter as ArrayParameterType,
  MultipleSelectParameter as MultipleSelectParameterType,
  Parameter,
  ParameterInputType,
  SelectParameter as SelectParameterType,
} from "types/action/parameters";

import ArrayParameter from "./parameters/ArrayParameter";
import GenericInputParameter from "./parameters/GenericInputParameter";
import MultipleSelectParameter from "./parameters/MultipleSelectParameter";
import SelectParameter from "./parameters/SelectParameter";
import TaskParameter from "./parameters/TaskParameter";

interface ParameterItemProps {
  parameter: Parameter;
}

const ParameterItem = ({ parameter }: ParameterItemProps): JSX.Element => {
  /**
   * Returns the apprioriate parameter component based on the type
   * For now the state handling part is not ideal since we modify the object directly
   */
  const inputComponent = (): JSX.Element => {
    const type = parameter.type;

    switch (type.name) {
      case "int":
      case "str":
      case "Path":
        return (
          <GenericInputParameter parameter={parameter as ParameterInputType} />
        );
      case "bool":
        return (
          <Switch
            defaultChecked={parameter.value !== null}
            color="info"
            onChange={(e) => (parameter.value = e.target.checked)}
          />
        );
      case "select":
        return (
          <SelectParameter
            parameter={parameter as SelectParameterType}
            onChange={(e) => (parameter.value = e.target.value)}
          />
        );
      case "range":
        return (
          <Slider
            min={type.start}
            max={type.end}
            step={type.increment}
            marks={type.increment >= 5}
            defaultValue={parameter.value as number}
            onChange={(e, newValue) =>
              (parameter.value = (newValue as number).toString())
            }
            valueLabelDisplay="on"
          />
        );
      case "task":
        return <TaskParameter />;
      case "multiple_select":
        return (
          <MultipleSelectParameter
            parameter={parameter as MultipleSelectParameterType}
            onChange={(newValues) => (parameter.value = newValues)}
          />
        );
      case "int_array":
        return (
          <ArrayParameter
            parameter={parameter as ArrayParameterType}
            onChange={(newValues) => (parameter.value = newValues)}
          />
        );
      default:
        return <div>Unknown parameter type</div>;
    }
  };

  return (
    <ListItem
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        my: 2,
        borderRadius: LIST_ITEM_BORDER_RADIUS,
      }}
    >
      <Typography sx={{ width: "30%", mr: 4 }}>{parameter.label}</Typography>

      <Box sx={{ width: "70%" }}>{inputComponent()}</Box>
    </ListItem>
  );
};

export default ParameterItem;
