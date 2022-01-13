import AgricultureIcon from "@mui/icons-material/Agriculture";
import BugReportIcon from "@mui/icons-material/BugReport";
import InputIcon from "@mui/icons-material/Input";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import { Box, Chip } from "@mui/material";
import LoadingChip from "components/common/chips/LoadingChip";
import SubmitButton from "components/common/chips/SubmitButton";
import FileIcon from "components/common/FileIcon/FileIcon";
import { uiSocket } from "context";
import { useHistory } from "react-router-dom";
import { colors } from "style/colors";
import { theme } from "style/theme";

const QuickLinks = (): JSX.Element => {
  const history = useHistory();

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Chip
        label="Explorer"
        variant="outlined"
        color="info"
        icon={<TravelExploreIcon />}
        onClick={() => history.push("/explorer")}
      />

      <Chip
        label="Tractor"
        variant="outlined"
        color="warning"
        icon={<AgricultureIcon />}
        onClick={() => history.push("/tractor")}
      />

      <Chip
        label="Ticket"
        variant="outlined"
        sx={{ color: "#e84f83", borderColor: "#e84f83" }}
        icon={<BugReportIcon style={{ color: "#e84f83" }} />}
        onClick={() => history.push("/ticket")}
      />

      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <SubmitButton />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderRadius: 10,
            gap: 1.2,
            px: 1.8,
            py: 1.5,
          }}
        >
          <LoadingChip
            label="Conform"
            color={theme.palette.success.main}
            icon={<InputIcon sx={{ color: theme.palette.success.main }} />}
            notif={{ message: "Launched conform action", variant: "success" }}
            onClick={(done) => {
              uiSocket.emit("launchAction", { action: "conform" }, () => {
                done();
              });
            }}
          />

          <LoadingChip
            label="Conform"
            disabled
            color={colors.houdini}
            icon={<FileIcon name="houdini" size={18} disabled />}
            notif={{ message: "Launched Houdini conform", variant: "success" }}
            onClick={(done) => {
              uiSocket.emit(
                "launchAction",
                { action: "conform", dcc: "houdini" },
                () => {
                  done();
                }
              );
            }}
          />

          <LoadingChip
            label="Conform"
            disabled
            color={colors.maya}
            icon={<FileIcon name="maya" size={18} disabled />}
            notif={{ message: "Launched Maya conform", variant: "success" }}
            onClick={(done) => {
              uiSocket.emit(
                "launchAction",
                { action: "conform", dcc: "maya" },
                () => {
                  done();
                }
              );
            }}
          />
        </Box>
      </div>
    </div>
  );
};

export default QuickLinks;
