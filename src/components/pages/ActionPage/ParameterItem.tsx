import { ListItem, Tooltip, Typography } from "@mui/material";
import { useAction } from "context";
import { LIST_ITEM_BORDER_RADIUS } from "style/constants";
import {
  ArrayParameter as ArrayParameterType,
  BooleanParameter,
  EditableListParameter as EditableListParameterType,
  FrameSetParameter as FrameSetParameterType,
  MultipleSelectParameter as MultipleSelectParameterType,
  Parameter,
  ParameterInputType,
  PathParameter as PathParameterType,
  RadioSelectParameter as RadioSelectParameterType,
  RangeParameter as RangeParameterType,
  SelectParameter as SelectParameterType,
  TaskParameter as TaskParameterType,
  TextParameter as TextParameterType,
} from "types/action/parameters";

import ArrayParameter from "./parameters/ArrayParameter";
import EditableListParameter from "./parameters/EditableListParameter";
import FrameSetParameter from "./parameters/FrameSetParameter";
import GenericInputParameter from "./parameters/GenericInputParameter";
import MultipleSelectParameter from "./parameters/MultipleSelectParameter";
import PathParameter from "./parameters/PathParameter";
import MultipleRadioSelectParameter from "./parameters/RadioSelectParameter";
import RangeParameter from "./parameters/RangeParameter";
import SelectParameter from "./parameters/SelectParameter";
import SwitchParameter from "./parameters/SwitchParameter";
import TaskParameter from "./parameters/TaskParameter/TaskParameter";
import TextParameter from "./parameters/TextParameter";

interface ParameterItemProps {
  parameter: Parameter;
}

/**
 * A parameter has a type and renders a different component based on that
 */
const ParameterItem = ({ parameter }: ParameterItemProps): JSX.Element => {
  const { simpleMode } = useAction();

  /**
   * Returns the apprioriate parameter component based on the type
   * For now the state handling part is not ideal since we modify the object directly
   */
  const inputComponent = (): JSX.Element => {
    const type = parameter.type;

    switch (type.name) {
      case "int":
      case "str":
        return (
          <GenericInputParameter parameter={parameter as ParameterInputType} />
        );

      case "Path":
        return <PathParameter parameter={parameter as PathParameterType} />;

      case "bool":
        return <SwitchParameter parameter={parameter as BooleanParameter} />;

      case "select":
        return (
          <SelectParameter
            parameter={parameter as SelectParameterType}
            onChange={(e) => (parameter.value = e.target.value)}
          />
        );
      case "range":
        return <RangeParameter parameter={parameter as RangeParameterType} />;
      case "task":
        return <TaskParameter parameter={parameter as TaskParameterType} />;
      case "task_file":
        return (
          <TaskParameter
            parameter={parameter as TaskParameterType}
            selectFile
          />
        );
      case "multiple_select":
        return (
          <MultipleSelectParameter
            parameter={parameter as MultipleSelectParameterType}
            onChange={(newValues) => (parameter.value = newValues)}
          />
        );
      case "radio_select":
        return (
          <MultipleRadioSelectParameter
            parameter={parameter as RadioSelectParameterType}
          />
        );
      case "editable_list":
        return (
          <EditableListParameter
            parameter={parameter as EditableListParameterType}
          />
        );
      case "int_array":
        return (
          <ArrayParameter
            parameter={parameter as ArrayParameterType}
            onChange={(newValues) => (parameter.value = newValues)}
          />
        );
      case "text":
        return <TextParameter parameter={parameter as TextParameterType} />;
      case "FrameSet":
        return (
          <FrameSetParameter parameter={parameter as FrameSetParameterType} />
        );
      default:
        return <div>Unknown parameter type: {JSON.stringify(type)}</div>;
    }
  };

  const label = (
    <Typography
      variant={simpleMode ? "subtitle2" : "body1"}
      sx={{ width: "30%", mr: 4 }}
    >
      {parameter.label}
    </Typography>
  );

  return (
    <ListItem
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        my: simpleMode ? 1 : 2,
        borderRadius: LIST_ITEM_BORDER_RADIUS,
      }}
    >
      {/* Label */}
      {!(parameter.type.name === "text") &&
        (parameter.tooltip ? (
          <Tooltip title={parameter.tooltip} arrow placement="top-start">
            {label}
          </Tooltip>
        ) : (
          label
        ))}

      {/* Specific parameter component */}
      <div
        style={{
          maxWidth: parameter.type.name === "text" ? "100%" : "70%",
          minWidth: parameter.type.name === "text" ? "100%" : "70%",
        }}
      >
        {inputComponent()}
      </div>
    </ListItem>
  );
};

export default ParameterItem;
