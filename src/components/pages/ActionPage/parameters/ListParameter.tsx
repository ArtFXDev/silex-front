import { Checkbox, Divider, List, ListItem } from "@mui/material";
import ParameterItem from "components/pages/ActionPage/ParameterItem";
import { useState } from "react";
import {
  ListParameter as ListParameterType,
  Parameter as ParameterType,
  ParameterValueTypeSpan,
} from "types/action/parameters";

interface ListParameterProps {
  parameter: ListParameterType;
  onChange: (newValues: ParameterValueTypeSpan[]) => void;
}

interface ChildParameterProps {
  parameter: ParameterType;
  enabled: boolean;
}

// Wrap the component of the child parameter to disable it or not
const ListChildParameter = ({ parameter, enabled }: ChildParameterProps) => {
  if (enabled) {
    return <ParameterItem parameter={parameter} />;
  }
  return (
    <div style={{ opacity: 0.4, pointerEvents: "none" }}>
      <ParameterItem parameter={parameter} />
    </div>
  );
};

const ListParameter = ({
  parameter,
  onChange,
}: ListParameterProps): JSX.Element => {
  // Store a copy of the values that will also store their states
  const valuesCopy: {
    value: typeof parameter.value[number];
    state: boolean;
  }[] = [];
  parameter.value.forEach((value) => {
    valuesCopy.push({ value: value, state: true });
  });

  const [values, setValues] = useState(valuesCopy);

  return (
    <List>
      {values.map((value, i) => {
        const childParameter = {
          type: parameter.type.itemType,
          value: value.value,
        } as ParameterType;
        return (
          <ListItem key={i}>
            <Checkbox
              defaultChecked
              onChange={(e) => {
                values[i].state = e.target.checked;
                setValues(
                  values.map((value, index) => {
                    if (index !== i) {
                      return value;
                    }
                    value.state = e.target.checked;
                    return value;
                  })
                );

                // Reset the actual parameter value on each update
                parameter.value = [];
                values
                  .filter((value) => value.state)
                  .forEach((value) => {
                    parameter.value.push(value.value);
                  });
              }}
            />
            <ListChildParameter
              parameter={childParameter}
              enabled={values[i].state}
            />
            {i !== values.length - 1 && <Divider />}
          </ListItem>
        );
      })}
    </List>
  );
};

export default ListParameter;
