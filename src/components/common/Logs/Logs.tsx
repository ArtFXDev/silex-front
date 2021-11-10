import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Box, IconButton, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { BORDER_RADIUS_BOTTOM } from "style/constants";
import { LogLine } from "types/action/action";

function colorFromLogStatus(message: LogLine["message"]): string {
  const match = /(INFO|ERROR|WARNING)/.exec(message);

  if (match && match.length > 0) return `${match[1].toLowerCase()}.main`;
  return "primary";
}

interface LogsProps {
  logs: LogLine[];
  regexp: RegExp;
}

const Logs = ({ logs, regexp }: LogsProps): JSX.Element => {
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Box
      sx={{
        backgroundColor: "#161b22",
        borderRadius: BORDER_RADIUS_BOTTOM,
        py: 2.5,
        pl: 3,
        pr: 1.5,
        maxHeight: 600,
        overflow: "auto",
        overflowX: "hidden",
      }}
    >
      <IconButton
        sx={{ position: "sticky", top: 0, float: "right" }}
        onClick={() => {
          navigator.clipboard.writeText(
            logs.map((l, i) => `${i}\t${l.message}`).join("\n")
          );
          enqueueSnackbar("Copied logs to clipboard", {
            variant: "success",
          });
        }}
      >
        <ContentCopyIcon fontSize="small" />
      </IconButton>

      {logs.map((logLine, i) => {
        // Manually reset the regexp
        regexp.lastIndex = 0;
        const splitLine = regexp.exec(logLine.message);

        return (
          <Box
            key={i}
            sx={{
              display: "flex",
              fontFamily: "monospace",
              color: "#8b949e",
              ":hover": { backgroundColor: "#22272e", color: "#acb6c0" },
              py: 0.2,
            }}
          >
            <span
              style={{
                color: "#8b949e",
                fontSize: "12px",
                textAlign: "right",
                minWidth: "40px",
              }}
            >
              {i}
            </span>

            <span
              style={{
                whiteSpace: "pre-wrap",
                padding: "0",
                overflowX: "auto",
              }}
            >
              {splitLine ? (
                splitLine.splice(1).map((part, i) => (
                  <Typography
                    key={i}
                    component="span"
                    color={
                      i === 1 || i === 3
                        ? colorFromLogStatus(logLine.message)
                        : "inherit"
                    }
                    sx={{
                      display: "inline-block",
                      fontFamily:
                        "ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace",
                      fontSize: "12px",
                      ml: i === 0 ? "15px" : "",
                      wordWrap: "break-word",
                      whiteSpace: "initial",
                      lineHeight: "20px",
                    }}
                  >
                    {part}&nbsp;
                  </Typography>
                ))
              ) : (
                <Typography
                  key={i}
                  component="span"
                  color={"inherit"}
                  sx={{
                    display: "inline-block",
                    fontFamily:
                      "ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace",
                    fontSize: "12px",
                    ml: "15px",
                    wordWrap: "break-word",
                    whiteSpace: "initial",
                    lineHeight: "20px",
                  }}
                >
                  {logLine.message}
                </Typography>
              )}
            </span>
          </Box>
        );
      })}
    </Box>
  );
};

export default Logs;
