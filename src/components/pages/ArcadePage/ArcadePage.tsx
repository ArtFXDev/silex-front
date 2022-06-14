/* eslint-disable camelcase */
import { gql, useQuery } from "@apollo/client";
import { CircularProgress, Paper, Typography } from "@mui/material";
import axios from "axios";
import { useAuth } from "context";
import { useEffect, useState } from "react";
import { Route, useParams } from "react-router-dom";
import { Game, GameVariant } from "types/entities/Game";
import { capitalize } from "utils/string";
import * as Zou from "utils/zou";

import PageWrapper from "../PageWrapper/PageWrapper";
import FlappyBird from "./games/FlappyBird";
import GameVariantItem from "./GameVariantItem";

const GAMES = gql`
  query GamesAndVariants($userID: ID!) {
    person(id: $userID) {
      id
      game_variants {
        id
      }
    }

    games {
      id
      name

      variants {
        id
        name
        title
        color
        price
        badge
      }
    }
  }
`;

const ArcadePage = (): JSX.Element => {
  const { user } = useAuth();

  const { data } = useQuery<{
    games: Game[];
    person: { game_variants: { id: string }[] };
  }>(GAMES, { variables: { userID: user ? user.id : "" } });

  return (
    <PageWrapper goBack title="🎮 Arcade">
      <Route exact path="/arcade">
        {data ? (
          data.games.length === 0 ? (
            <p>No games...</p>
          ) : (
            data.games.map((game) => (
              <div key={game.id} style={{ marginTop: 20 }}>
                <Typography
                  style={{
                    fontSize: 30,
                    display: "inline-block",
                  }}
                >
                  {capitalize(game.name)}
                </Typography>

                <Paper
                  key={game.id}
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 20,
                    marginTop: 20,
                    padding: 25,
                    borderRadius: 20,
                  }}
                >
                  {game.variants
                    .slice()
                    .sort((a, b) => a.price - b.price)
                    .map((variant) => {
                      const isVariantUnlocked =
                        data.person.game_variants.find(
                          (v) => v.id === variant.id
                        ) !== undefined;

                      return (
                        <GameVariantItem
                          key={variant.id}
                          game={game}
                          variant={variant}
                          unlocked={isVariantUnlocked}
                        />
                      );
                    })}
                </Paper>
              </div>
            ))
          )
        ) : (
          <CircularProgress />
        )}
      </Route>

      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Route path="/arcade/:variantId">
          <GameVariantRouter />
        </Route>
      </div>
    </PageWrapper>
  );
};

const GameVariantRouter = (): JSX.Element => {
  const [gameVariant, setGameVariant] = useState<GameVariant>();
  const { user } = useAuth();

  const { variantId } = useParams<{ variantId: string }>();

  useEffect(() => {
    axios
      .get(Zou.zouAPIURL(`data/game_variants/${variantId}`), {
        withCredentials: true,
      })
      .then((response) => setGameVariant(response.data));
  }, [variantId]);

  if (!gameVariant) return <div>Loading...</div>;

  if (
    user &&
    !user.game_variants.find((v) => (v as unknown as string) === gameVariant.id)
  )
    return <div>You don{"'"}t have access to this game...</div>;

  switch (gameVariant.game.name) {
    case "flappy":
      return <FlappyBird gameVariant={gameVariant} />;
    default:
      return <div>Unknown game variant...</div>;
  }
};

export default ArcadePage;
