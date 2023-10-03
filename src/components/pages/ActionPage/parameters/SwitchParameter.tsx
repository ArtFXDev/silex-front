import { Switch } from "@mui/material";
import { useEffect, useState } from "react";
import { useMatch } from "react-router-dom";

import { useAction } from "~/context";
import { BooleanParameter } from "~/types/action/parameters";

interface SwitchParameterProps {
  parameter: BooleanParameter;
}

const SwitchParameter = ({ parameter }: SwitchParameterProps): JSX.Element => {
  const [checked, setChecked] = useState<boolean>(parameter.value === true);

  const actionUUID = useMatch(":uuid")?.params.uuid as string;
  const { sendActionUpdate } = useAction();

  useEffect(() => {
    setChecked(parameter.value === true);
  }, [parameter]);

  return (
    <Switch
      checked={checked}
      color="info"
      onChange={(e) => {
        parameter.value = e.target.checked;
        setChecked(e.target.checked);
        sendActionUpdate(actionUUID, false);
      }}
    />
  );
};

export default SwitchParameter;
