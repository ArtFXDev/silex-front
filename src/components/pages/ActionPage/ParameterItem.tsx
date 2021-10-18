import { Input, ListItem, Typography } from "@mui/material";
import { LIST_ITEM_BORDER_RADIUS } from "style/constants";
import { Parameter } from "types/action/action";

interface FileWithPath extends File {
  readonly path: string;
}

interface ParameterItemProps {
  parameter: Parameter;
}

const pythonTypeToInputType = (
  type: Parameter["type"]
): React.InputHTMLAttributes<unknown>["type"] => {
  switch (type) {
    case "int":
      return "number";
    case "str":
      return "text";
    case "Path":
      return "file";
    default:
      return "text";
  }
};

const ParameterItem = ({ parameter }: ParameterItemProps): JSX.Element => {
  const inputComponent = (type: Parameter["type"]): JSX.Element => {
    switch (type) {
      case "int":
      case "str":
      case "Path":
        return (
          <Input
            type={pythonTypeToInputType(parameter.type)}
            placeholder={parameter.value}
            onChange={(e) => {
              const targetAsInput = e.target as HTMLInputElement;

              if (type === "Path" && targetAsInput.files) {
                const files = targetAsInput.files;
                parameter.value = (files[0] as FileWithPath).path;
              } else {
                parameter.value = e.target.value;
              }
            }}
            color="info"
          />
        );
      default:
        return <div>Unknown parameter type {parameter.type}</div>;
    }
  };

  return (
    <ListItem
      sx={{
        width: "60%",
        display: "flex",
        justifyContent: "space-between",
        my: 2,
        borderRadius: LIST_ITEM_BORDER_RADIUS,
      }}
    >
      <Typography>{parameter.label}</Typography>

      {inputComponent(parameter.type)}
    </ListItem>
  );
};

export default ParameterItem;
