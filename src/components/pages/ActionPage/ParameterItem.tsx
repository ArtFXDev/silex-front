import { Input, ListItem, Typography } from "@mui/material";
import { LIST_ITEM_BORDER_RADIUS } from "style/constants";
import { Parameter } from "types/action/action";

interface ParameterItemProps {
  parameter: Parameter;
}

const pythonTypeToInput = (
  type: Parameter["type"]
): React.InputHTMLAttributes<unknown>["type"] => {
  switch (type) {
    case "int":
      return "number";
    case "str":
      return "text";
    default:
      return "text";
  }
};

const ParameterItem = ({ parameter }: ParameterItemProps): JSX.Element => {
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

      <Input
        type={pythonTypeToInput(parameter.type)}
        placeholder={parameter.value}
        onChange={(e) => (parameter.value = e.target.value)}
        color="info"
      />
    </ListItem>
  );
};

export default ParameterItem;
