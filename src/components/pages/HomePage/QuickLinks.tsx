import AgricultureIcon from "@mui/icons-material/Agriculture";
import BugReportIcon from "@mui/icons-material/BugReport";
import InputIcon from "@mui/icons-material/Input";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import { Box, Chip } from "@mui/material";
import LoadingChip from "components/common/chips/LoadingChip";
import SubmitButton from "components/common/chips/SubmitButton";
import FileIcon from "components/common/FileIcon/FileIcon";
import { uiSocket } from "context";
import { useHistory } from "react-router-dom";
import { COLORS } from "style/colors";
import { theme } from "style/theme";

const QuickLinks = (): JSX.Element => {
  const history = useHistory();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexWrap: "wrap",
      }}
    >
      <Chip
        label="Explorer"
        variant="outlined"
        color="info"
        icon={<TravelExploreIcon style={{ marginLeft: 5 }} />}
        onClick={() => history.push("/explorer")}
      />

      <Chip
        label="Stats"
        variant="outlined"
        sx={{ color: "#b19ef9", borderColor: "#b19ef9" }}
        icon={<QueryStatsIcon style={{ color: "#b19ef9", marginLeft: 5 }} />}
        onClick={() => history.push("/stats")}
      />

      <Chip
        label="Ticket"
        variant="outlined"
        sx={{ color: "#e84f83", borderColor: "#e84f83" }}
        icon={<BugReportIcon style={{ color: "#e84f83", marginLeft: 5 }} />}
        onClick={() => history.push("/ticket")}
      />

      <Chip
        label="Tractor"
        variant="outlined"
        color="warning"
        icon={<AgricultureIcon style={{ marginLeft: 5 }} />}
        onClick={() => history.push("/tractor")}
      />

      <Chip
        label="Harvest"
        variant="outlined"
        sx={{ color: "#78b454", borderColor: "#78b454" }}
        icon={<p style={{ fontSize: 20, marginLeft: 10 }}>👨‍🌾</p>}
        onClick={() => history.push("/harvest")}
      />

      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <SubmitButton disabled />

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
            clickNotification={{
              message: "Launched conform action",
              variant: "success",
            }}
            onClick={(done) => {
              uiSocket.emit("launchAction", { action: "conform" }, () => {
                done();
              });
            }}
          />

          <LoadingChip
            label="Conform"
            disabled
            color={COLORS.houdini}
            icon={<FileIcon name="houdini" size={18} disabled />}
            clickNotification={{
              message: "Launched Houdini conform",
              variant: "success",
            }}
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
            color={COLORS.maya}
            icon={<FileIcon name="maya" size={18} disabled />}
            clickNotification={{
              message: "Launched Maya conform",
              variant: "success",
            }}
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
