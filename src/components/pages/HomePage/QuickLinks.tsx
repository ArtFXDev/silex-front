import AgricultureIcon from "@mui/icons-material/Agriculture";
import InputIcon from "@mui/icons-material/Input";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import { Box, Chip } from "@mui/material";
import CustomChip from "components/common/CustomChip/CustomChip";
import DCCLogo from "components/common/DCCLogo/DCCLogo";
import { uiSocket } from "context";
import { useHistory } from "react-router-dom";
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
        <CustomChip
          label="Conform"
          color={theme.palette.success.main}
          icon={<InputIcon sx={{ color: theme.palette.success.main }} />}
          onClick={(done) => {
            uiSocket.emit("launchAction", { action: "conform" }, () => {
              done();
            });
          }}
        />

        <CustomChip
          label="Conform"
          color="#ff6600"
          icon={<DCCLogo name="houdini" size={18} />}
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

        <CustomChip
          label="Conform"
          color="#2fb6b9"
          icon={<DCCLogo name="maya" size={18} />}
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
  );
};

export default QuickLinks;