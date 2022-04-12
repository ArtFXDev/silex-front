/* eslint-disable camelcase */
import { useApolloClient } from "@apollo/client";
import { Paper, TextField, Typography } from "@mui/material";
import LoadingChip from "components/common/chips/LoadingChip";
import FrameSetTextField from "components/common/FrameSetTextField/FrameSetTextField";
import ValidationTimeline from "components/common/ValidationTimeline/ValidationTimeline";
import { useState } from "react";
import { theme } from "style/theme";
import { Shot } from "types/entities";
import { isFrameSetValid } from "utils/frameset";
import {
  unvalidateShotFrameSet,
  updateEntity,
  validateShotFrameSet,
} from "utils/zou";

import ValidationHistoryChart from "./ValidationHistoryChart";

interface ShotHeaderProps {
  shot: Shot;
}

const ShotHeader = ({ shot }: ShotHeaderProps): JSX.Element => {
  const [frameSet, setFrameSet] = useState<string>("");

  const client = useApolloClient();
  const frameSetValid = isFrameSetValid(frameSet);
  const frameIn = shot.frame_in || 1;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 20,
        flexWrap: "wrap",
      }}
    >
      <div>
        <div style={{ marginBottom: 10 }}>
          <Typography fontSize={14} style={{ marginBottom: 5 }}>
            Frames
          </Typography>

          <TextField
            size="small"
            type="number"
            sx={{ width: 100 }}
            defaultValue={shot.nb_frames}
            placeholder={shot.nb_frames ? undefined : "..."}
            onBlur={(e) => {
              const number = parseInt(e.target.value);

              if (!isNaN(number)) {
                updateEntity<Shot>(shot.id, {
                  nb_frames: number,
                }).then(() =>
                  client.refetchQueries({ include: ["TasksForAssetOrShot"] })
                );
              }
            }}
          />
        </div>

        <div>
          <Typography fontSize={14} style={{ marginBottom: 5 }}>
            FPS
          </Typography>

          <TextField
            size="small"
            type="number"
            sx={{ width: 100 }}
            defaultValue={shot.fps}
            placeholder={shot.fps ? undefined : "..."}
            onBlur={(e) => {
              const number = parseInt(e.target.value);

              if (!isNaN(number)) {
                updateEntity<Shot>(shot.id, {
                  fps: number,
                });
              }
            }}
          />
        </div>
      </div>

      <div>
        <Typography fontSize={14} style={{ marginBottom: 5 }}>
          Validation
        </Typography>

        <Paper
          elevation={0}
          style={{
            display: "inline-block",
            border: "1px solid #5d5c5c",
            borderRadius: 10,
            padding: 15,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <FrameSetTextField
              value={frameSet}
              width={150}
              onChange={(e) => setFrameSet(e.target.value)}
              removeError
              infoMessage={
                shot.nb_frames
                  ? "Fill this to validate frames"
                  : "First enter the number of frames on the left"
              }
            />

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <LoadingChip
                label="Validate"
                color={theme.palette.success.main}
                successNotification={{
                  message: "Frames validated",
                  variant: "success",
                }}
                disabled={!frameSetValid || !shot.nb_frames}
                onClick={(done) => {
                  validateShotFrameSet(shot.id, frameSet).then(() => {
                    client.refetchQueries({ include: "active" });
                    done();
                  });

                  setFrameSet("");
                }}
              />

              <LoadingChip
                label="Unvalidate"
                color={theme.palette.warning.dark}
                successNotification={{
                  message: "Frames validated",
                  variant: "success",
                }}
                disabled={!frameSetValid || !shot.nb_frames}
                onClick={(done) => {
                  unvalidateShotFrameSet(shot.id, frameSet).then(() => {
                    client.refetchQueries({ include: "active" });
                    done();
                  });

                  setFrameSet("");
                }}
              />
            </div>
          </div>
        </Paper>
      </div>

      {shot.nb_frames && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            marginTop: 13,
            marginLeft: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              marginLeft: 30,
            }}
          >
            {shot.validation && (
              <Typography
                color="success.main"
                fontSize={12}
                style={{ marginBottom: 4 }}
              >
                {shot.validation.frame_set.split(",").join(", ")}
              </Typography>
            )}

            <ValidationTimeline
              frameSet={shot.validation ? shot.validation.frame_set : ""}
              tempFrameSet={frameSet}
              totalFrames={shot.nb_frames}
              frameIn={frameIn}
              width="90%"
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                marginTop: 8,
              }}
            >
              <Typography
                fontSize={11}
                color="text.disabled"
                textAlign="center"
                display="inline-block"
                width={30}
              >
                {frameIn}
              </Typography>

              {shot.validation && (
                <Typography
                  fontSize={12}
                  color="success.main"
                  textAlign="center"
                  display="inline-block"
                >
                  {Math.floor((shot.validation.total / shot.nb_frames) * 100)} %
                </Typography>
              )}

              <Typography
                fontSize={11}
                width={30}
                color="text.disabled"
                textAlign="center"
                display="inline-block"
              >
                {frameIn + shot.nb_frames - 1}
              </Typography>
            </div>
          </div>

          {shot.validation_history.length > 0 && (
            <div style={{ height: 100, width: 400 }}>
              <ValidationHistoryChart
                validationHistory={shot.validation_history}
                totalFrames={shot.nb_frames}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShotHeader;
