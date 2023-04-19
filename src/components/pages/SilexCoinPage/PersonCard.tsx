import { Box, Card, CardActions, CardMedia, Zoom } from "@mui/material";

import SilexCoinIcon from "~/assets/images/silex_coin.svg";
import ColoredCircle from "~/components/common/ColoredCircle/ColoredCircle";
import LazyMedia from "~/components/utils/LazyMedia/LazyMedia";
import { Person } from "~/types/entities";
import { GameVariant } from "~/types/entities/Game";
import { getColorFromString } from "~/utils/color";
import * as Zou from "~/utils/zou";

interface PersonCardProps {
  index: number;
  person: Person;
  data: {
    persons: Person[];
    game_variants: GameVariant[];
  };
}

const PersonCard = ({ person, index }: PersonCardProps): JSX.Element => {
  const coins = person.coins || 0;

  return (
    <Zoom in style={{ transitionDelay: `${index * 10}ms` }}>
      <Card raised sx={{ width: 140, position: "relative" }}>
        <CardMedia style={{ position: "relative" }}>
          <LazyMedia
            src={
              person.has_avatar
                ? {
                    url: Zou.pictureThumbnailURL("persons", person.id),
                    extension: "png",
                  }
                : undefined
            }
            width={140}
            height={140}
            alt={person.full_name}
            disableBorder
            objectFit="contain"
          />

          {index <= 2 && (
            <div
              style={{
                position: "absolute",
                right: 0,
                bottom: 5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: (3 - index) * 3 + 8,
                width: 40,
              }}
            >
              🏆
            </div>
          )}
        </CardMedia>

        <CardActions>
          {person.first_name} {person.last_name}
        </CardActions>

        <div
          style={{
            position: "absolute",
            top: 10,
            left: 15,
            display: "flex",
            flexDirection: "row-reverse",
          }}
        >
          {person.projects.map((p) => (
            <ColoredCircle
              marginLeft={-5}
              key={p.name}
              color={getColorFromString(p.name)}
              size={15}
              style={{ boxShadow: "0px 0px 3px rgba(0, 0, 0, 0.4)" }}
            />
          ))}
        </div>

        <Box
          sx={{
            position: "absolute",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            borderRadius: "9999px",
            right: 5,
            top: 5,
            display: "flex",
            alignItems: "center",
            ml: 2,
            pl: 1.2,
            pr: 1.2,
            py: 0.5,
            fontSize: 12,
          }}
        >
          {coins}
          <img
            width={15}
            height={15}
            src={SilexCoinIcon}
            style={{
              marginLeft: 5,
              filter: `grayscale(${coins === 0 ? "1" : "0"})`,
            }}
          />
        </Box>
      </Card>
    </Zoom>
  );
};

export default PersonCard;
