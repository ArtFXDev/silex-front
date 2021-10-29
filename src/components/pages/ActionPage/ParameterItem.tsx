import { Box, ListItem, Slider, Switch, Typography } from "@mui/material";
import { LIST_ITEM_BORDER_RADIUS } from "style/constants";
import {
  Parameter,
  ParameterInputType,
  SelectParameter as SelectParameterType,
} from "types/action/parameters";

import GenericInputParameter from "./parameters/GenericInputParameter";
import SelectParameter from "./parameters/SelectParameter";

interface ParameterItemProps {
  parameter: Parameter;
}

const ParameterItem = ({ parameter }: ParameterItemProps): JSX.Element => {
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
