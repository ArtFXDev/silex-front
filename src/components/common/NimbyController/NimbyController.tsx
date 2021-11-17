import AirlineSeatReclineExtraIcon from "@mui/icons-material/AirlineSeatReclineExtra";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import PortableWifiOffIcon from "@mui/icons-material/PortableWifiOff";
import {
  Box,
  BoxProps,
  Chip,
  ClickAwayListener,
  Fade,
  Paper,
  Popper,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useBlade } from "context/BladeContext";
import { useState } from "react";
import { secondsToDhms } from "utils/date";

import Separator from "../Separator/Separator";

const Arrow = styled("div")({
  position: "absolute",
  fontSize: 8,
  "&::before": {
    content: '""',
    margin: "auto",
    display: "block",
    width: 0,
    height: 0,
    borderStyle: "solid",
  },
});

const PopperWithArrow = styled(Popper)(() => ({
  zIndex: 1,
  "& > div": {
    position: "relative",
  },
  "& .MuiPopper-arrow": {
    top: 0,
    right: 20,
    marginTop: "-0.9em",
    width: "3em",
    height: "1em",
    "&::before": {
      borderWidth: "0 1em 1em 1em",
      borderColor: `transparent transparent #454444 transparent`,
    },
  },
}));

const NimbyController = ({ sx }: BoxProps): JSX.Element => {
  const { bladeStatus } = useBlade();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(!open);
  };

  const handleToggleNimby = () => {
    const newStatus = !(bladeStatus?.nimby !== "None");
    window.electron.send("setNimbyStatus", newStatus);
  };

  const handleToggleAutoMode = () => {
    window.electron.send("setNimbyAutoMode", !bladeStatus?.nimbyAutoMode);
  };

  const nimbyON = bladeStatus?.nimby !== "None";
  const color = bladeStatus ? (nimbyON ? "success" : "error") : "warning";

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box sx={{ ...sx }}>
        <Chip
          label="Nimby"
          color={color}
          variant="outlined"
          onClick={handleClick}
          onDelete={handleClick}
          deleteIcon={
            bladeStatus ? (
              nimbyON ? (
                <AirlineSeatReclineExtraIcon />
              ) : (
                <DirectionsRunIcon />
              )
            ) : (
              <PortableWifiOffIcon />
            )
          }
        />

        <PopperWithArrow
          open={open}
          anchorEl={anchorEl}
          transition
          sx={{ mt: 3 }}
          placement="bottom-end"
          modifiers={[
            {
              name: "offset",
              options: {
                offset: [0, 15],
              },
            },
          ]}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <div>
                <Arrow className="MuiPopper-arrow" />
                <Paper elevation={4} sx={{ width: "200px" }}>
                  <Box sx={{ p: 2 }} color="text.disabled" fontSize="14px">
                    {bladeStatus ? (
                      <>
                        <div>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            Mode:
                            <Switch
                              color="info"
                              checked={bladeStatus.nimbyAutoMode}
                              onClick={handleToggleAutoMode}
                            />
                            <Typography fontSize="14px" display="inline-block">
                              {bladeStatus.nimbyAutoMode ? "AUTO" : "MANUAL"}
                            </Typography>
                            <Tooltip
                              title={
                                bladeStatus.nimbyAutoMode
                                  ? "Let the system handle the status"
                                  : "You have control over the Nimby"
                              }
                              sx={{ ml: bladeStatus.nimbyAutoMode ? 1 : 0.5 }}
                              arrow
                            >
                              <HelpOutlineIcon
                                color="disabled"
                                fontSize="small"
                              />
                            </Tooltip>
                          </div>

                          <div>
                            Status:
                            <Switch
                              checked={nimbyON}
                              color={color}
                              onClick={handleToggleNimby}
                              disabled={bladeStatus.nimbyAutoMode}
                            />
                            <Typography
                              color={`${color}.dark`}
                              fontSize="14px"
                              display="inline-block"
                              sx={{ ml: 1 }}
                            >
                              {nimbyON ? "ON" : "OFF"}
                            </Typography>
                          </div>

                          <Typography color={`${color}.main`} fontSize="14px">
                            {nimbyON
                              ? "You are protected from render jobs"
                              : "Your computer can host jobs from the render farm"}
                          </Typography>
                        </div>
                        <Separator />
                        Host: {bladeStatus.hnm}
                        <Separator />
                        Uptime: <br />
                        {secondsToDhms(bladeStatus.uptime)}
                        <Separator />
                        Profile: {bladeStatus.profile}
                      </>
                    ) : (
                      <Typography color="warning.main" fontSize="14px">
                        The Tractor blade service is not connected...
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </div>
            </Fade>
          )}
        </PopperWithArrow>
      </Box>
    </ClickAwayListener>
  );
};

export default NimbyController;
