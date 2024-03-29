import { LinearProgress, Typography } from "@mui/material";

import { TextParameter as TextParameterType } from "~/types/action/parameters";

interface TextParameterProps {
  parameter: TextParameterType;
}

const TextParameter = ({ parameter }: TextParameterProps): JSX.Element => {
  return (
    <div>
      <Typography
        color={parameter.type.color ? `${parameter.type.color}.main` : ""}
      >
        {parameter.value &&
          parameter.value.split(/(\n)/g).map((token, i) =>
            token === "\n" ? (
              <br key={i} />
            ) : (
              <span key={i} style={{ wordBreak: "break-word" }}>
                {token}
              </span>
            )
          )}
      </Typography>

      {/* progress */}
      {parameter.type.progress && (
        <LinearProgress
          variant={parameter.type.progress.variant}
          value={parameter.type.progress.value}
          sx={{ mt: 2 }}
          color={parameter.type.color}
        />
      )}
    </div>
  );
};

export default TextParameter;
