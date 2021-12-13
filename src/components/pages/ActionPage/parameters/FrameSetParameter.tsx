import { TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { FrameSetParameter as FrameSetParameterType } from "types/action/parameters";

/**
 * fileseq regex format
 * Taken from: https://github.com/justinfx/fileseq/blob/master/src/fileseq/constants.py
 */
const FRANGE_PATTERN =
  /^(-?\d+(?:\.\d+)?)(?:-(-?\d+(?:\.\d+)?)(?:([:xy])(-?\d+(?:\.\d+)?))?)?$/;

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

  const tokens = value.split(",");
  const matches = tokens.map((token) => token.match(FRANGE_PATTERN));

  const error = matches.some((v) => v === null);

  return (
    <>
      <TextField
        variant="standard"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          parameter.value = e.target.value;
        }}
        helperText={error ? "The format is not valid" : undefined}
        color={error ? "error" : "info"}
        error={error}
        sx={{ width: "50%" }}
      />

      <div style={{ marginTop: "10px" }}>
        {!error &&
          (matches.filter((m) => m !== null) as RegExpMatchArray[]).map(
            (match, i) => {
              let text = "";

              const size = match.filter((t) => t !== undefined).length - 1;

              if (size >= 1) {
                text += `frame ${match[1]}`;
              }

              if (size >= 2) {
                text += ` to ${match[2]}`;
              }

              if (size >= 3) {
                if (match[3] === "x") {
                  text += `, every ${match[4]}th frame`;
                } else if (match[3] === "y") {
                  text += `, every frames not multiple of ${match[4]}`;
                } else if (match[3] === ":") {
                  text += `, every ${match[4]}th down to 1th frame`;
                }
              }

              return (
                <Typography fontSize={13} color="text.disabled" key={i}>
                  {text}
                </Typography>
              );
            }
          )}
      </div>
    </>
  );
};

export default FrameSetParameter;
