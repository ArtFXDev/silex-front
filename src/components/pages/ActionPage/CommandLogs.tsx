import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Box, Collapse, IconButton, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { BORDER_RADIUS_BOTTOM } from "style/constants";
import { Command, LogLine } from "types/action/action";

function colorFromLogStatus(status: LogLine["level"]): string {
  switch (status) {
    case "ERROR":
    case "INFO":
    case "WARNING":
      return `${status.toLowerCase()}.main`;
    default:
      return "primary";
  }
}

interface CommandLogsProps {
  command: Command;
  openLogs?: boolean;
  openLogsBasedOnStatus: boolean;
}

const CommandLogs = ({
  command,
  openLogs,
  openLogsBasedOnStatus,
}: CommandLogsProps): JSX.Element => {
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Collapse in={openLogs || openLogsBasedOnStatus}>
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
              command.logs.map((l, i) => `${i}\t${l.message}`).join("\n")
            );
            enqueueSnackbar("Copied logs to clipboard", {
              variant: "success",
            });
          }}
        >
          <ContentCopyIcon fontSize="small" />
        </IconButton>

        {command.logs.map((logLine, i) => {
          const regexp =
            /(\[SILEX\] {4}\[.+\]) ([A-Z ]{10})(\| {4}\[.+\]) (.{50,}) (\([0-9]+\))/g;
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
                          ? colorFromLogStatus(logLine.level)
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
    </Collapse>
  );
};

export default CommandLogs;
