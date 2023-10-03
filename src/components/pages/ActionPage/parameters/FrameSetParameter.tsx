import { useEffect, useState } from "react";

import FrameSetTextField from "~/components/common/FrameSetTextField/FrameSetTextField";
import { FrameSetParameter as FrameSetParameterType } from "~/types/action/parameters";

interface FrameSetParameterProps {
  parameter: FrameSetParameterType;
}

const FrameSetParameter = ({
  parameter,
}: FrameSetParameterProps): JSX.Element => {
  const [value, setValue] = useState<string>("");

  // Update state when the parameter value from action changes
  useEffect(() => {
    setValue(parameter.value || "");
  }, [parameter]);

  return (
    <FrameSetTextField
      value={value}
      width="50%"
      onChange={(e) => {
        setValue(e.target.value);
        parameter.value = e.target.value;
      }}
    />
  );
};

export default FrameSetParameter;
