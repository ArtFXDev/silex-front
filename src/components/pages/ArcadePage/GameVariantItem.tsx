/* eslint-disable camelcase */
import { useApolloClient } from "@apollo/client";
import { Box, Paper, Typography } from "@mui/material";
import { keyframes } from "@mui/system";
import LockImage from "assets/images/arcade/lock.png";
import SilexCoinIcon from "assets/images/silex_coin.svg";
import AnimatedNumber from "components/common/AnimatedNumber/AnimatedNumber";
import { useAuth } from "context";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Game, GameVariant } from "types/entities/Game";
import * as Zou from "utils/zou";

const GAMES_IMAGE_CONTEXT = require.context(`assets/images/arcade/games`, true);

const wiggleAnimation = keyframes`
  0%   {transform: rotate(0deg)}
  15%   {transform: rotate(5deg)}
  25%  {transform: rotate(-7deg)}
  50%  {transform: rotate(8deg)}
  75%  {transform: rotate(-4deg)}
  100% {transform: rotate(0deg)}
`;

interface GameVariantItemProps {
  game: Game;
  variant: GameVariant;
  unlocked: boolean;
}

const GameVariantItem = ({
  variant,
  game,
  unlocked,
}: GameVariantItemProps): JSX.Element => {
  const [animatedValue, setAnimatedValue] = useState<boolean>(false);
  const history = useHistory();
  const client = useApolloClient();
  const { enqueueSnackbar } = useSnackbar();
  const auth = useAuth();

  const unlockVariant = () => {
    Zou.unlockGameVariant(variant.id)
      .then(() => {
        client.refetchQueries({ include: "active" }).then(auth.updateUser);
      })
      .catch(() =>
        enqueueSnackbar("You don't have enough Silex to buy this item!", {
          variant: "error",
        })
      );
  };

  return (
    <div
      key={variant.id}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <div
        onClick={() => {
          if (unlocked) {
            history.push(`/arcade/${variant.id}`);
          } else {
            if (auth.user && (auth.user.coins || 0) >= variant.price) {
              setAnimatedValue(true);
            } else {
              enqueueSnackbar("You don't have enough Silex to buy this item!", {
                variant: "error",
              });
            }
          }
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
            position: "relative",
            "&:hover": {
              transform: unlocked ? "translateY(-5px)" : "",
              animation: !unlocked
                ? `${wiggleAnimation} 0.4s infinite ease`
                : "",
              animationIterationCount: 1,
            },
          }}
        >
          <div
            style={{
              overflow: "hidden",
              borderRadius: 25,
              width: 150,
              height: 150,
              boxShadow: "5px 5px 8px rgba(0, 0, 0, 0.4)",
            }}
          >
            <img
              style={{
                width: "100%",
                height: "100%",
                transition: "all 0.2s ease",
                filter: !unlocked ? "blur(4px)" : "blur(0px)",
              }}
              src={
                GAMES_IMAGE_CONTEXT(
                  `./${game.name}/${variant.name}/thumbnail.png`
                ).default
              }
            />
          </div>

          <img
            src={LockImage}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              borderRadius: 25,
              filter: "drop-shadow(5px 5px 3px rgba(0, 0, 0, 0.7))",
              transition: "all 0.2s ease",
              opacity: unlocked ? 0 : 1,
            }}
          />

          <Paper
            elevation={1}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              display: "flex",
              alignItems: "center",
              borderRadius: "9999px",
              transition: "all 0.2s ease",
              pl: 1,
              pr: 0.8,
              py: 0.2,
              opacity: unlocked ? 0 : 1,
            }}
          >
            <AnimatedNumber
              on={animatedValue}
              range={{ from: variant.price, to: 0 }}
              duration={800}
              onCompletion={unlockVariant}
            />

            <img
              style={{ marginLeft: 3 }}
              width={18}
              height={18}
              src={SilexCoinIcon}
            />
          </Paper>
        </Box>
      </div>

      <Typography
        style={{
          color: variant.color || "black",
          marginTop: 10,
        }}
      >
        {!unlocked
          ? variant.title
              .split(" ")
              .map((w) => "*".repeat(w.length))
              .join(" ")
          : variant.title}
      </Typography>
    </div>
  );
};

export default GameVariantItem;
