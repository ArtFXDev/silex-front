import { Slider } from "@mui/material";
import { styled } from "@mui/material/styles";
import { RangeParameter as RangeParameterType } from "types/action/parameters";

const CustomSlider = styled(Slider)(() => ({
  color: "#66bb6a",
  height: 2,
  "& .MuiSlider-mark": {
    backgroundColor: "#ggg",
    height: 8,
    width: 1,
    "&.MuiSlider-markActive": {
      opacity: 1,
      backgroundColor: "currentColor",
    },
  },
  "& .MuiSlider-thumb": {
    height: 24,
    width: 24,
    border: "2px solid currentColor",
    "&:hover": {
      boxShadow: "0 0 0 8px rgba(58, 133, 137, 0.16)",
    },
  },
  "& .MuiSlider-valueLabel": {
    backgroundColor: "#393939",
    boxShadow: "0 0 0 2px rgba(80, 80, 80, 0.4)",
  },
}));

function createMarks(start: number, end: number, steps: number) {
  const marks = [];

  for (let i = 0; i <= steps; i++) {
    const value = Math.floor((i / steps) * (end - start));
    marks.push({ value, label: value });
  }

  return marks;
}

interface RangeParameterProps {
  parameter: RangeParameterType;
}

const RangeParameter = ({ parameter }: RangeParameterProps): JSX.Element => {
  const type = parameter.type;

  return (
    <CustomSlider
      min={type.start}
      max={type.end}
      step={type.increment}
      marks={
        type.marks
          ? createMarks(type.start, type.end, type.n_marks || 5)
          : false
      }
      valueLabelFormat={(value) =>
        parameter.type.value_label ? `${value} ${type.value_label}` : value
      }
      valueLabelDisplay="on"
      defaultValue={parameter.value as number}
      onChange={(e, newValue) =>
        (parameter.value = Array.isArray(newValue) ? newValue[0] : newValue)
      }
    />
  );
};

export default RangeParameter;
