import { Alert, Input } from "@mui/material";
import isElectron from "is-electron";
import { ParameterInputType } from "types/action/parameters";

/**
 * Extends the interface in case we are in Electron
 * and the path attribute is given
 */
interface FileWithPath extends File {
  readonly path: string;
}

/**
 * Maps python type to input type
 */
const pythonTypeToInputType = (
  type: ParameterInputType["type"]["name"]
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

interface GenericInputParameterProps {
  parameter: ParameterInputType;
}

const GenericInputParameter = ({
  parameter,
}: GenericInputParameterProps): JSX.Element => {
  if (!isElectron() && parameter.type.name === "Path") {
    return (
      <Alert variant="filled" color="warning">
        You are not viewing this inside Electron, the Path input is not going to
        work
      </Alert>
    );
  }

  return (
    <Input
      type={pythonTypeToInputType(parameter.type.name)}
      placeholder={parameter.value?.toString()}
      onChange={(e) => {
        const targetAsInput = e.target as HTMLInputElement;

        if (parameter.type.name === "Path" && targetAsInput.files) {
          const files = targetAsInput.files;

          if (files.length > 0) {
            parameter.value = (files[0] as FileWithPath).path;
          }
        } else {
          parameter.value = e.target.value;
        }
      }}
      color="info"
    />
  );
};

export default GenericInputParameter;
