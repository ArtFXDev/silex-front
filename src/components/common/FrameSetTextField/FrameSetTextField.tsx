import { TextField, Typography } from "@mui/material";
import { isFrameSetValid, parseFrameSet } from "utils/frameset";

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
          matches.map((match, i) => {
            let text = "";
            const size = match.length;

            if (size >= 1) {
              text += `frame ${match[0]}`;
            }

            if (size >= 2) {
              text += ` to ${match[1]}`;
            }

            if (size >= 3) {
              if (match[2] === "x") {
                text += `, every ${match[3]}th frame`;
              } else if (match[2] === "y") {
                text += `, every frames not multiple of ${match[4]}`;
              } else if (match[2] === ":") {
                text += `, every ${match[4]}th down to 1th frame`;
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
