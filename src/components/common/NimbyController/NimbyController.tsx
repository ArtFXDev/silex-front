import AirlineSeatReclineExtraIcon from "@mui/icons-material/AirlineSeatReclineExtra";
import CheckIcon from "@mui/icons-material/Check";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import PortableWifiOffIcon from "@mui/icons-material/PortableWifiOff";
import {
  Badge,
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
import { useState } from "react";
import { useHistory } from "react-router";

import { useBlade } from "~/context/BladeContext";
import { secondsToDhms } from "~/utils/date";

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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);

  const { bladeStatus } = useBlade();
  const history = useHistory();

  // Toggle the nimby ON or OFF
  const handleToggleNimby = () => {
    window.electron.send("setNimbyStatus", bladeStatus && !bladeStatus.nimbyON);
  };

  // Toggle the nimby auto mode to auto
  const handleToggleAutoMode = () => {
    window.electron.send("setNimbyAutoMode", !bladeStatus?.nimbyAutoMode);
  };

  // Called when the user open the Nimby menu
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  // Called when going to /running-jobs
  const handleClickOnRunningJobs = () => {
    setOpen(false);
    history.push("/running-jobs");
  };

  const color = bladeStatus
    ? bladeStatus.nimbyON
      ? "success"
      : "error"
    : "warning";
  const noRunningProcesses = bladeStatus?.pids.length === 0;

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box sx={{ ...sx }}>
        <Badge
          badgeContent={bladeStatus && bladeStatus.pids.length}
          color="error"
        >
          <Chip
            label="Nimby"
            color={color}
            variant="outlined"
            onClick={handleOpenMenu}
            onDelete={handleOpenMenu}
            deleteIcon={
              bladeStatus ? (
                bladeStatus.nimbyON ? (
                  <AirlineSeatReclineExtraIcon />
                ) : (
                  <DirectionsRunIcon />
                )
              ) : (
                <PortableWifiOffIcon />
              )
            }
          />
        </Badge>

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
                offset: [0, 12],
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
                              checked={bladeStatus.nimbyON}
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
                              {bladeStatus.nimbyON ? "ON" : "OFF"}
                            </Typography>
                          </div>

                          <Typography color={`${color}.main`} fontSize="14px">
                            {bladeStatus.nimbyON
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
                        <Separator />
                        <Chip
                          label={`Running tasks: ${bladeStatus.pids.length}`}
                          variant="outlined"
                          color={noRunningProcesses ? "success" : "warning"}
                          sx={{
                            mt: 0.5,
                          }}
                          onClick={
                            noRunningProcesses
                              ? undefined
                              : handleClickOnRunningJobs
                          }
                          onDelete={handleClickOnRunningJobs}
                          deleteIcon={
                            noRunningProcesses ? (
                              <CheckIcon />
                            ) : (
                              <ExitToAppIcon />
                            )
                          }
                        />
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
