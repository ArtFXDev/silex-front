import { TextField, Typography } from "@mui/material";

import { isFrameSetValid, parseFrameSet } from "~/utils/frameset";

interface FrameSetTextFieldProps {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  width?: string | number;
  removeError?: boolean;
  infoMessage?: string;
}

const FrameSetTextField = ({
  value,
  onChange,
  width,
  removeError,
  infoMessage,
}: FrameSetTextFieldProps): JSX.Element => {
  const matches = parseFrameSet(value);
  const error = !isFrameSetValid(value);

  return (
    <div>
      <TextField
        variant="standard"
        value={value}
        onChange={onChange}
        helperText={
          !removeError
            ? error
              ? "The format is not valid"
              : undefined
            : value.length === 0
            ? infoMessage
            : undefined
        }
        color={!removeError && error ? "error" : "info"}
        error={!removeError && error}
        sx={{ width: width || "auto" }}
      />

      <div style={{ marginTop: "10px" }}>
        {!error &&
          matches.map((pattern, i) => {
            let text = "";

            if (pattern.type === "single" || pattern.type === "range") {
              text += `frame ${pattern.start}`;
            }

            if (pattern.type === "range") {
              text += ` to ${pattern.end}`;

              if (pattern.step) {
                text += `, every ${pattern.step}th frame`;
              }
            }

            return (
              <Typography fontSize={13} color="text.disabled" key={i}>
                {text}
              </Typography>
            );
          })}
      </div>
    </div>
  );
};

export default FrameSetTextField;
